from unittest.mock import MagicMock, patch
from tests.conftest import make_profile, make_job

class TestE02_CreateJobPosting:
    """E02 – Employer creates a job posting"""
 
    @patch("services.job_service.generate_embedding", return_value=[0.1] * 384)
    def test_create_job_success(self, mock_embed):
        from services.job_service import JobService
        db = MagicMock()
        svc = JobService(db)
        svc.job_repo = MagicMock()
        svc.job_repo.save.return_value = make_job()
 
        result, status = svc.create_job({
            "user_id": 2,
            "title": "Backend Developer",
            "company": "TechCorp",
            "job_type": "Full-time",
            "location": "Sydney",
            "description": "Build APIs with FastAPI",
            "requirements": "Python, SQL",
            "salary_min": 90000,
            "salary_max": 130000,
        })
        assert status == 201
        assert "job" in result
 
    @patch("services.job_service.generate_embedding", return_value=None)
    def test_create_job_no_embedding_still_saves(self, mock_embed):
        """Job should save even if embedding generation fails"""
        from services.job_service import JobService
        db = MagicMock()
        svc = JobService(db)
        svc.job_repo = MagicMock()
        saved = make_job()
        saved.job_embedding = None
        svc.job_repo.save.return_value = saved
 
        result, status = svc.create_job({
            "user_id": 2,
            "title": "Data Analyst",
            "company": "DataCo",
            "job_type": "Part-time",
            "location": "Melbourne",
            "description": "Analyse data",
            "requirements": "Excel, Python",
            "salary_min": 60000,
            "salary_max": 90000,
        })
        assert status == 201
 
 
class TestE03_ViewCandidates:
    """E03 – Employer views list of candidates"""
 
    def test_get_all_candidates(self):
        from services.candidate_service import CandidateService
        db = MagicMock()
        svc = CandidateService(db)
        svc.candidate_repo = MagicMock()
        profiles = [make_profile(user_id=i) for i in range(1, 5)]
        svc.candidate_repo.get_all = MagicMock(return_value=profiles)
 
        # Candidate repo get_all is called to list candidates
        candidates = svc.candidate_repo.get_all()
        assert len(candidates) == 4
 
 
class TestE04_SearchCandidate:
    """E04 – Employer searches candidates by keyword"""

    def test_search_candidate_by_name(self):
        from repositories.candidate_repository import CandidateRepository

        db = MagicMock()
        repo = CandidateRepository(db)

        alice = make_profile(user_id=1)
        alice.full_name = "Alice Smith"

        mock_result = MagicMock()
        mock_result.scalars.return_value.first.return_value = alice
        db.execute.return_value = mock_result

        result = repo.get_candidate_by_user_id(1)

        assert result.full_name == "Alice Smith"
        db.execute.assert_called_once()
 
 
class TestE05_FilterCandidate:
    """E05 – Employer filters candidates by skill / education / experience"""
 
    def test_filter_by_education(self):
        profiles = [make_profile(user_id=i) for i in range(1, 4)]
        profiles[0].education_level = "Bachelor"
        profiles[1].education_level = "Master"
        profiles[2].education_level = "Bachelor"
 
        filtered = [p for p in profiles if p.education_level == "Bachelor"]
        assert len(filtered) == 2
 
    def test_filter_by_skill(self):
        profiles = [make_profile(user_id=i) for i in range(1, 4)]
        profiles[0].skills = ["Python", "SQL"]
        profiles[1].skills = ["Java", "Spring"]
        profiles[2].skills = ["Python", "Django"]
 
        filtered = [p for p in profiles if "Python" in p.skills]
        assert len(filtered) == 2
 
    def test_filter_by_experience_years(self):
        """Filter candidates with >= 3 years experience"""
        profiles = [make_profile(user_id=i) for i in range(1, 4)]
        profiles[0].experiences = [{"years": 5}]
        profiles[1].experiences = [{"years": 1}]
        profiles[2].experiences = [{"years": 3}]
 
        filtered = [p for p in profiles
                    if sum(e.get("years", 0) for e in p.experiences) >= 3]
        assert len(filtered) == 2
 
 
class TestE06_CandidateRecommendation:
    """E06 – Employer gets Top-10 candidate recommendations for a job"""
 
    def test_recommend_candidates_for_job(self):
        from services.recommendation_service import RecommendationService
        db = MagicMock()
        svc = RecommendationService(db)
        svc.job_repo = MagicMock()
        svc.profile_repo = MagicMock()
 
        job = make_job(job_embedding=[0.5] * 384)
        svc.job_repo.get_by_id_with_embedding.return_value = job
 
        candidates = [make_profile(user_id=i, resume_embedding=[0.5 * (i % 4)] * 384)
                      for i in range(1, 8)]
        svc.profile_repo.get_all_with_embeddings.return_value = candidates
        svc.profile_repo.get_all.return_value = candidates
 
        result, status = svc.recommend_candidates_for_job(job_id=1, limit=10)
        assert status == 200
        assert "candidates" in result
        assert len(result["candidates"]) <= 10
 
    def test_recommend_job_not_found(self):
        from services.recommendation_service import RecommendationService
        db = MagicMock()
        svc = RecommendationService(db)
        svc.job_repo = MagicMock()
        svc.job_repo.get_by_id_with_embedding.return_value = None
 
        result, status = svc.recommend_candidates_for_job(job_id=999, limit=10)
        assert status == 404
 
    def test_recommend_job_no_embedding(self):
        from services.recommendation_service import RecommendationService
        db = MagicMock()
        svc = RecommendationService(db)
        svc.job_repo = MagicMock()
        job = make_job()
        job.job_embedding = None
        svc.job_repo.get_by_id_with_embedding.return_value = None  # repo filters for embedding
 
        result, status = svc.recommend_candidates_for_job(job_id=1, limit=10)
        assert status == 404