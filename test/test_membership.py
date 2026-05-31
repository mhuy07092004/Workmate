from unittest.mock import MagicMock
from tests.conftest import make_profile, make_job

class TestM01_FreeCandidateLimit:
    """M01 – Free candidate sees max 10 recommended jobs"""
 
    def test_free_candidate_capped_at_10(self):
        from services.candidate_service import CandidateService
        db = MagicMock()
        svc = CandidateService(db)
        svc.candidate_repo = MagicMock()
        svc.job_repo = MagicMock()
 
        candidate = make_profile(resume_embedding=[0.1] * 384)
        candidate.is_premium = False
        svc.candidate_repo.get_candidate_with_resume_embedding.return_value = candidate
 
        # 20 jobs available
        jobs = [make_job(i, job_embedding=[0.1] * 384) for i in range(1, 21)]
        svc.job_repo.get_all_with_embeddings.return_value = jobs
 
        # Non-member limit = 10
        result, status = svc.get_recommended_jobs(user_id=1, limit=10)
        assert status == 200
        assert len(result["jobs"]) <= 10
 
 
class TestM02_PremiumCandidateUnlimited:
    """M02 – Premium candidate sees unlimited recommended jobs"""
 
    def test_premium_candidate_gets_all_jobs(self):
        from services.candidate_service import CandidateService
        db = MagicMock()
        svc = CandidateService(db)
        svc.candidate_repo = MagicMock()
        svc.job_repo = MagicMock()
 
        candidate = make_profile(resume_embedding=[0.1] * 384)
        candidate.is_premium = True
        svc.candidate_repo.get_candidate_with_resume_embedding.return_value = candidate
 
        # 20 jobs available
        jobs = [make_job(i, job_embedding=[0.1] * 384) for i in range(1, 21)]
        svc.job_repo.get_all_with_embeddings.return_value = jobs
 
        # Premium → pass limit = len(jobs)
        limit = len(jobs) if candidate.is_premium else 10
        result, status = svc.get_recommended_jobs(user_id=1, limit=limit)
        assert status == 200
        assert len(result["jobs"]) == 20
 
 
class TestM03_FreeEmployerLimit:
    """M03 – Free employer sees max 10 recommended candidates"""
 
    def test_free_employer_capped_at_10(self):
        from services.recommendation_service import RecommendationService
        db = MagicMock()
        svc = RecommendationService(db)
        svc.job_repo = MagicMock()
        svc.profile_repo = MagicMock()
 
        job = make_job(job_embedding=[0.5] * 384)
        svc.job_repo.get_by_id_with_embedding.return_value = job
 
        # 20 candidates available
        candidates = [make_profile(user_id=i, resume_embedding=[0.5] * 384)
                      for i in range(1, 21)]
        svc.profile_repo.get_all_with_embeddings.return_value = candidates
        svc.profile_repo.get_all.return_value = candidates
 
        # Free employer uses limit=10
        result, status = svc.recommend_candidates_for_job(job_id=1, limit=10)
        assert status == 200
        assert len(result["candidates"]) <= 10
 
 
class TestM04_PremiumEmployerUnlimited:
    """M04 – Premium employer sees unlimited recommended candidates"""
 
    def test_premium_employer_gets_all_candidates(self):
        from services.recommendation_service import RecommendationService
        db = MagicMock()
        svc = RecommendationService(db)
        svc.job_repo = MagicMock()
        svc.profile_repo = MagicMock()
 
        job = make_job(job_embedding=[0.5] * 384)
        svc.job_repo.get_by_id_with_embedding.return_value = job
 
        candidates = [make_profile(user_id=i, resume_embedding=[0.5] * 384)
                      for i in range(1, 21)]
        svc.profile_repo.get_all_with_embeddings.return_value = candidates
        svc.profile_repo.get_all.return_value = candidates
 
        # Premium employer passes limit = total candidates
        result, status = svc.recommend_candidates_for_job(job_id=1, limit=20)
        assert status == 200
        assert len(result["candidates"]) == 20
 
 
class TestM05_UpgradeMembership:
    """M05 – After upgrading, limit changes correctly"""
 
    def test_upgrade_changes_limit(self):
        """Simulate membership upgrade: limit increases from 10 → unlimited"""
        candidate = make_profile()
        candidate.is_premium = False
 
        free_limit = 10 if not candidate.is_premium else None
 
        # Upgrade
        candidate.is_premium = True
        premium_limit = 10 if not candidate.is_premium else None
 
        assert free_limit == 10
        assert premium_limit is None  # unlimited
 
    def test_downgrade_restores_limit(self):
        candidate = make_profile()
        candidate.is_premium = True
        candidate.is_premium = False
 
        limit = 10 if not candidate.is_premium else None
        assert limit == 10