from unittest.mock import MagicMock, patch, mock_open
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

class TestR17_ResumePDFUpload:
    """R1.7 – Candidate uploads resume PDF; system extracts text and generates embedding"""

    @patch("services.profile_service.os.path.exists", return_value=True)
    @patch("services.profile_service.generate_embedding", return_value=[0.1] * 384)
    @patch("builtins.open", mock_open(read_data=b"%PDF-fake"))
    @patch("services.profile_service.PyPDF2.PdfReader")
    def test_create_profile_with_resume_triggers_embedding(self, mock_reader_cls, mock_embed, mock_exists):
        """When resume_url is present and file exists, embedding is generated and stored"""
        from services.profile_service import ProfileService
        mock_page = MagicMock()
        mock_page.extract_text.return_value = "Python developer with 3 years experience"
        mock_reader_cls.return_value.pages = [mock_page]
        db = MagicMock()
        svc = ProfileService(db)
        svc.profile_repo = MagicMock()
        svc.profile_repo.get_by_user_id.return_value = None
        svc.profile_repo.get_by_user_phone.return_value = None
        svc.profile_repo.save.return_value = make_profile()
        result, status = svc.create_profile({
            "user_id": 1, "full_name": "Alice", "email": "alice@test.com",
            "phone": "0411111111", "education_level": "Bachelor",
            "major": "CS", "school": "UOW",
            "resume_url": "/uploads/alice_resume.pdf",
        })
        assert status == 201
        mock_embed.assert_called_once()

    @patch("services.profile_service.os.path.exists", return_value=False)
    def test_create_profile_without_resume_file_skips_embedding(self, mock_exists):
        """If resume file does not exist on disk, embedding generation is skipped gracefully"""
        from services.profile_service import ProfileService
        db = MagicMock()
        svc = ProfileService(db)
        svc.profile_repo = MagicMock()
        svc.profile_repo.get_by_user_id.return_value = None
        svc.profile_repo.get_by_user_phone.return_value = None
        svc.profile_repo.save.return_value = make_profile()
        result, status = svc.create_profile({
            "user_id": 1, "full_name": "Bob", "email": "bob@test.com",
            "phone": "0422222222", "resume_url": "/uploads/missing.pdf",
        })
        assert status == 201

    @patch("services.profile_service.os.path.exists", return_value=True)
    @patch("services.profile_service.generate_embedding", return_value=[0.1] * 384)
    @patch("builtins.open", mock_open(read_data=b"%PDF-fake"))
    @patch("services.profile_service.PyPDF2.PdfReader")
    def test_extracted_text_stored_in_profile(self, mock_reader_cls, mock_embed, mock_exists):
        """Extracted resume text is stored in profile_data before save"""
        from services.profile_service import ProfileService
        resume_text = "Experienced backend engineer, Python, FastAPI"
        mock_page = MagicMock()
        mock_page.extract_text.return_value = resume_text
        mock_reader_cls.return_value.pages = [mock_page]
        db = MagicMock()
        svc = ProfileService(db)
        svc.profile_repo = MagicMock()
        svc.profile_repo.get_by_user_id.return_value = None
        svc.profile_repo.get_by_user_phone.return_value = None
        saved = make_profile()
        saved.resume_text = resume_text
        svc.profile_repo.save.return_value = saved
        result, status = svc.create_profile({
            "user_id": 1, "full_name": "Carol", "email": "carol@test.com",
            "phone": "0433333333", "resume_url": "/uploads/carol_resume.pdf",
        })
        assert status == 201
        call_kwargs = svc.profile_repo.save.call_args[0][0]
        assert "resume_text" in call_kwargs
        assert call_kwargs["resume_text"] == resume_text

    @patch("services.profile_service.os.path.exists", return_value=True)
    @patch("builtins.open", mock_open(read_data=b"%PDF-fake"))
    @patch("services.profile_service.PyPDF2.PdfReader")
    def test_empty_pdf_skips_embedding(self, mock_reader_cls, mock_exists):
        """If PDF extraction returns empty text, embedding generation is skipped"""
        from services.profile_service import ProfileService
        mock_page = MagicMock()
        mock_page.extract_text.return_value = ""
        mock_reader_cls.return_value.pages = [mock_page]
        db = MagicMock()
        svc = ProfileService(db)
        svc.profile_repo = MagicMock()
        svc.profile_repo.get_by_user_id.return_value = None
        svc.profile_repo.get_by_user_phone.return_value = None
        svc.profile_repo.save.return_value = make_profile()
        result, status = svc.create_profile({
            "user_id": 1, "full_name": "Dave", "email": "dave@test.com",
            "phone": "0444444444", "resume_url": "/uploads/empty.pdf",
        })
        assert status == 201
        call_kwargs = svc.profile_repo.save.call_args[0][0]
        assert "resume_embedding" not in call_kwargs


class TestNR41_ResumeEmbeddingPipeline:
    """NR4.1 – generate_resume_embedding_for_user() full pipeline"""

    @patch("services.profile_service.os.path.exists", return_value=True)
    @patch("services.profile_service.generate_embedding", return_value=[0.2] * 384)
    @patch("builtins.open", mock_open(read_data=b"%PDF-fake"))
    @patch("services.profile_service.PyPDF2.PdfReader")
    def test_generate_embedding_for_existing_user_success(self, mock_reader_cls, mock_embed, mock_exists):
        """Full pipeline: existing profile + PDF → text extracted → embedding stored"""
        from services.profile_service import ProfileService
        mock_page = MagicMock()
        mock_page.extract_text.return_value = "Machine learning engineer with 5 years experience"
        mock_reader_cls.return_value.pages = [mock_page]
        db = MagicMock()
        svc = ProfileService(db)
        svc.profile_repo = MagicMock()
        svc.profile_repo.get_by_user_id.return_value = make_profile()
        # result = svc.generate_resume_embedding_for_user(user_id=1, resume_path="/uploads/resume.pdf")
        result = svc.generate_resume_embedding_for_user(user_id=1, resume_filepath="/uploads/resume.pdf", resume_url="/uploads/resume.pdf")
        assert result is True
        svc.profile_repo.update.assert_called_once()
        update_data = svc.profile_repo.update.call_args[0][1]
        assert "resume_embedding" in update_data
        assert len(update_data["resume_embedding"]) == 384
        assert "resume_text" in update_data

    def test_generate_embedding_user_not_found_returns_false(self):
        """Returns False when profile does not exist for given user_id"""
        from services.profile_service import ProfileService
        db = MagicMock()
        svc = ProfileService(db)
        svc.profile_repo = MagicMock()
        svc.profile_repo.get_by_user_id.return_value = None
        # result = svc.generate_resume_embedding_for_user(user_id=999, resume_path="/uploads/any.pdf")
        result = svc.generate_resume_embedding_for_user(user_id=999, resume_filepath="/uploads/any.pdf", resume_url="/uploads/any.pdf")
        assert result is False
        svc.profile_repo.update.assert_not_called()

    @patch("services.profile_service.os.path.exists", return_value=False)
    def test_generate_embedding_missing_file_returns_false(self, mock_exists):
        """Returns False when resume file does not exist on disk"""
        from services.profile_service import ProfileService
        db = MagicMock()
        svc = ProfileService(db)
        svc.profile_repo = MagicMock()
        svc.profile_repo.get_by_user_id.return_value = make_profile()
        # result = svc.generate_resume_embedding_for_user(user_id=1, resume_path="/uploads/missing.pdf")
        result = svc.generate_resume_embedding_for_user(user_id=1, resume_filepath="/uploads/missing.pdf", resume_url="/uploads/missing.pdf")
        assert result is False
        svc.profile_repo.update.assert_not_called()

    @patch("services.profile_service.os.path.exists", return_value=True)
    @patch("services.profile_service.generate_embedding", return_value=None)
    @patch("builtins.open", mock_open(read_data=b"%PDF-fake"))
    @patch("services.profile_service.PyPDF2.PdfReader")
    def test_generate_embedding_fails_gracefully(self, mock_reader_cls, mock_embed, mock_exists):
        """Returns False (does not crash) when embedding model returns None"""
        from services.profile_service import ProfileService
        mock_page = MagicMock()
        mock_page.extract_text.return_value = "Some resume text"
        mock_reader_cls.return_value.pages = [mock_page]
        db = MagicMock()
        svc = ProfileService(db)
        svc.profile_repo = MagicMock()
        svc.profile_repo.get_by_user_id.return_value = make_profile()
        # result = svc.generate_resume_embedding_for_user(user_id=1, resume_path="/uploads/resume.pdf")
        result = svc.generate_resume_embedding_for_user(user_id=1, resume_filepath="/uploads/resume.pdf", resume_url="/uploads/resume.pdf")
        assert result is False
        svc.profile_repo.update.assert_not_called()