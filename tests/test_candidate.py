from unittest.mock import MagicMock
from tests.conftest import make_profile, make_job

class TestC02_CreateCandidateProfile:
    """C02 – Create candidate profile (name, contact, education, major, experience)"""

    def test_create_profile_success(self):
        from services.profile_service import ProfileService
        db = MagicMock()
        svc = ProfileService(db)
        svc.profile_repo = MagicMock()
        svc.profile_repo.get_by_user_id.return_value = None
        svc.profile_repo.get_by_user_phone.return_value = None
        svc.profile_repo.save.return_value = make_profile()

        result, status = svc.create_profile({
            "user_id": 1,
            "full_name": "Alice",
            "email": "alice@test.com",
            "phone": "0411111111",
            "education_level": "Bachelor",
            "major": "Computer Science",
            "school": "UOW",
        })
        assert status == 201
        svc.profile_repo.save.assert_called_once()

    def test_create_profile_missing_required_fields(self):
        from services.profile_service import ProfileService
        db = MagicMock()
        svc = ProfileService(db)
        svc.profile_repo = MagicMock()
        svc.profile_repo.get_by_user_id.return_value = None

        result, status = svc.create_profile({
            "user_id": 1,
            "full_name": "",       # missing
            "email": "a@test.com",
            "phone": "0411111111"
        })
        assert status == 400

    def test_create_profile_duplicate_user(self):
        # Duplicate is detected via get_by_user_id — same user_id already has a profile
        from services.profile_service import ProfileService
        db = MagicMock()
        svc = ProfileService(db)
        svc.profile_repo = MagicMock()
        svc.profile_repo.get_by_user_id.return_value = make_profile()

        result, status = svc.create_profile({
            "user_id": 1,
            "full_name": "Alice",
            "email": "alice@test.com",
            "phone": "0400000001",
        })
        assert status == 400


class TestC03_CandidateViewAllJobs:
    """C03 – Candidate can view all job listings"""

    def test_get_all_jobs_returns_list(self):
        from services.job_service import JobService
        db = MagicMock()
        svc = JobService(db)
        svc.job_repo = MagicMock()
        jobs = [make_job(i) for i in range(1, 4)]
        svc.job_repo.get_all.return_value = jobs

        result, status = svc.get_jobs()
        assert status == 200
        assert "jobs" in result
        assert len(result["jobs"]) == 3

    def test_get_all_jobs_empty_db(self):
        from services.job_service import JobService
        db = MagicMock()
        svc = JobService(db)
        svc.job_repo = MagicMock()
        svc.job_repo.get_all.return_value = []

        result, status = svc.get_jobs()
        assert status == 200
        assert result["jobs"] == []


class TestC04_CandidateKeywordSearch:
    """C04 – Candidate keyword search on job descriptions"""

    def test_search_by_title_keyword(self):
        from services.job_service import JobService
        db = MagicMock()
        svc = JobService(db)
        svc.job_repo = MagicMock()
        svc.job_repo.search.return_value = [
            # Include description + requirements so fuzzy matcher has content to score against
            make_job(1, title="Software Engineer", description="Backend development", requirements="Python, SQL"),
            make_job(2, title="Software Developer", description="Frontend development", requirements="React, TypeScript"),
        ]

        # Use "keyword" — "title" is not a supported filter key in the service
        result, status = svc.search_jobs({"keyword": "software engineer"})
        assert status == 200
        assert len(result["jobs"]) >= 1

    def test_search_no_results(self):
        from services.job_service import JobService
        db = MagicMock()
        svc = JobService(db)
        svc.job_repo = MagicMock()
        svc.job_repo.search.return_value = []

        # Use "keyword" — "title" is not a supported filter key in the service
        result, status = svc.search_jobs({"keyword": "astronaut"})
        assert status == 200
        assert result["jobs"] == []


class TestC05_JobRecommendation:
    """C05 – Top-10 job recommendations for candidate (non-member limit)"""

    def test_recommendation_returns_max_10_for_free_user(self):
        from services.candidate_service import CandidateService
        db = MagicMock()
        svc = CandidateService(db)
        svc.candidate_repo = MagicMock()
        svc.job_repo = MagicMock()

        candidate = make_profile(resume_embedding=[0.1] * 384)
        svc.candidate_repo.get_candidate_with_resume_embedding.return_value = candidate

        jobs = [make_job(i, job_embedding=[0.1 * (i % 5)] * 384) for i in range(1, 21)]
        svc.job_repo.get_all_with_embeddings.return_value = jobs

        result, status = svc.get_recommended_jobs(user_id=1, limit=10)
        assert status == 200
        assert len(result["jobs"]) <= 10

    def test_recommendation_sorted_by_score(self):
        from services.candidate_service import CandidateService
        from utils.embeddings import calculate_cosine_similarity
        db = MagicMock()
        svc = CandidateService(db)
        svc.candidate_repo = MagicMock()
        svc.job_repo = MagicMock()

        candidate = make_profile(resume_embedding=[1.0] * 384)
        svc.candidate_repo.get_candidate_with_resume_embedding.return_value = candidate

        # jobs with different embeddings → different scores
        jobs = [
            make_job(1, job_embedding=[1.0] * 384),   # high similarity
            make_job(2, job_embedding=[0.0] * 384),   # zero similarity
        ]
        svc.job_repo.get_all_with_embeddings.return_value = jobs

        result, status = svc.get_recommended_jobs(user_id=1, limit=10)
        assert status == 200
        scores = [j["similarity_score"] for j in result["jobs"]]
        assert scores == sorted(scores, reverse=True)

    def test_recommendation_no_jobs(self):
        from services.candidate_service import CandidateService
        db = MagicMock()
        svc = CandidateService(db)
        svc.candidate_repo = MagicMock()
        svc.job_repo = MagicMock()

        candidate = make_profile(resume_embedding=[0.1] * 384)
        svc.candidate_repo.get_candidate_with_resume_embedding.return_value = candidate
        svc.job_repo.get_all_with_embeddings.return_value = []

        result, status = svc.get_recommended_jobs(user_id=1)
        assert status == 200
        assert result["jobs"] == []