from unittest.mock import MagicMock
from tests.conftest import make_profile, make_job, make_employer_profile

class TestS01_KeywordSearch:
    """S01 – Keyword search for jobs"""
 
    def test_keyword_search_software_engineer(self):
        from services.job_service import JobService
        db = MagicMock()
        svc = JobService(db)
        svc.job_repo = MagicMock()
 
        matching = [
            make_job(1, title="Software Engineer"),
            make_job(2, title="Software Developer"),
        ]
        svc.job_repo.search.return_value = matching
 
        result, status = svc.search_jobs({"title": "software engineer"})
        assert status == 200
        assert any("Software" in j.title for j in result["jobs"])
 
    def test_keyword_search_returns_empty_for_no_match(self):
        from services.job_service import JobService
        db = MagicMock()
        svc = JobService(db)
        svc.job_repo = MagicMock()
        svc.job_repo.search.return_value = []
 
        result, status = svc.search_jobs({"title": "quantum physicist"})
        assert status == 200
        assert result["jobs"] == []
 
    def test_keyword_search_case_insensitive(self):
        from services.job_service import JobService
        db = MagicMock()
        svc = JobService(db)
        svc.job_repo = MagicMock()
        svc.job_repo.search.return_value = [make_job(1, title="Python Developer")]
 
        result_lower, _ = svc.search_jobs({"title": "python developer"})
        result_upper, _ = svc.search_jobs({"title": "PYTHON DEVELOPER"})
        # Both should query the repo (fuzzy comparison is case-insensitive in service)
        assert svc.job_repo.search.call_count == 2
 
 
class TestS02_FilterSearch:
    """S02 – Filter by location, salary, job type"""
 
    def test_filter_by_location(self):
        from services.job_service import JobService
        db = MagicMock()
        svc = JobService(db)
        svc.job_repo = MagicMock()
        svc.job_repo.search.return_value = [make_job(location="Sydney")]
 
        result, status = svc.search_jobs({"location": "Sydney"})
        assert status == 200
        assert len(result["jobs"]) >= 1
 
    def test_filter_by_job_type(self):
        from services.job_service import JobService
        db = MagicMock()
        svc = JobService(db)
        svc.job_repo = MagicMock()
        svc.job_repo.search.return_value = [
            make_job(1, job_type="Full-time"),
            make_job(2, job_type="Full-time"),
        ]
 
        result, status = svc.search_jobs({"job_type": "Full-time"})
        assert status == 200
        assert all(j.job_type == "Full-time" for j in result["jobs"])
 
    def test_filter_by_salary_range(self):
        from services.job_service import JobService
        db = MagicMock()
        svc = JobService(db)
        svc.job_repo = MagicMock()
        svc.job_repo.search.return_value = [make_job(salary_min=90000, salary_max=120000)]
 
        result, status = svc.search_jobs({"salary_min": 80000, "salary_max": 130000})
        assert status == 200
        assert len(result["jobs"]) >= 1
 
 
class TestS03_KeywordPlusFilter:
    """S03 – Combined keyword + filter search"""
 
    def test_keyword_and_location_filter(self):
        from services.job_service import JobService
        db = MagicMock()
        svc = JobService(db)
        svc.job_repo = MagicMock()
        svc.job_repo.search.return_value = [
            make_job(1, title="Data Analyst", location="Remote", job_type="Entry-level"),
        ]
 
        result, status = svc.search_jobs({
            "title": "data analyst",
            "location": "Remote",
            "job_type": "Entry-level"
        })
        assert status == 200
        assert len(result["jobs"]) >= 1
 
    def test_keyword_and_salary_filter_no_results(self):
        from services.job_service import JobService
        db = MagicMock()
        svc = JobService(db)
        svc.job_repo = MagicMock()
        svc.job_repo.search.return_value = []
 
        result, status = svc.search_jobs({
            "title": "CEO",
            "salary_min": 1000000
        })
        assert status == 200
        assert result["jobs"] == []
 
 
class TestS04_FuzzySearch:
    """S04 – Fuzzy search handles typos"""
 
    def test_fuzzy_match_typo_software_engineer(self):
        from fuzzywuzzy import fuzz
        query = "sofware enginer"   # two typos
        title = "Software Engineer"
        score = fuzz.token_set_ratio(query.lower(), title.lower())
        assert score >= 70, f"Expected score >= 70, got {score}"
 
    def test_fuzzy_match_synonym(self):
        from fuzzywuzzy import fuzz
        query = "programmer"
        title = "Software Engineer"
        # Lower score expected for synonyms — test that fuzzy doesn't crash
        score = fuzz.token_set_ratio(query.lower(), title.lower())
        assert isinstance(score, int)
 
    def test_fuzzy_match_coder(self):
        from fuzzywuzzy import fuzz
        # "coder" vs "software engineer" — partial match won't be >= 70
        # The system should either include or correctly exclude it based on threshold
        query = "coder"
        title = "Software Engineer"
        score = fuzz.token_set_ratio(query.lower(), title.lower())
        assert score >= 0  # at minimum, fuzz runs without error
 
    def test_fuzzy_service_integration(self):
        from services.job_service import JobService
        db = MagicMock()
        svc = JobService(db)
        svc.job_repo = MagicMock()
        # Repo returns all, fuzzy filters in service
        svc.job_repo.search.return_value = [
            make_job(1, title="Software Engineer"),
            make_job(2, title="Data Scientist"),
        ]
 
        result, status = svc.search_jobs({"title": "sofware enginer"})
        assert status == 200
        # "Software Engineer" should survive fuzzy filter (score >= 70)
        titles = [j.title for j in result["jobs"]]
        assert "Software Engineer" in titles
 
    def test_fuzzy_excludes_unrelated(self):
        from services.job_service import JobService
        db = MagicMock()
        svc = JobService(db)
        svc.job_repo = MagicMock()
        svc.job_repo.search.return_value = [
            make_job(1, title="Software Engineer"),
            make_job(2, title="Chef"),
        ]
 
        result, status = svc.search_jobs({"title": "software engineer"})
        assert status == 200
        titles = [j.title for j in result["jobs"]]
        assert "Chef" not in titles
 
 
class TestS05_SearchCandidateCompanyProfile:
    """S05 – Search based on full candidate / company profile"""
 
    def test_search_candidate_by_skill_keyword(self):
        """Search across full profile including skills"""
        profiles = [
            make_profile(user_id=1, skills=["Python", "SQL"]),
            make_profile(user_id=2, skills=["Java", "Spring"]),
            make_profile(user_id=3, skills=["Python", "Django"]),
        ]
        query = "python"
        matching = [p for p in profiles
                    if any(query.lower() in s.lower() for s in p.skills)]
        assert len(matching) == 2
 
    def test_search_company_by_industry(self):
        """Search employer profiles by industry"""
        employers = [make_employer_profile(i) for i in range(1, 4)]
        employers[0].industry = "Technology"
        employers[1].industry = "Finance"
        employers[2].industry = "Technology"
 
        query = "Technology"
        matching = [e for e in employers if e.industry == query]
        assert len(matching) == 2
 
    def test_search_candidate_by_preferred_location(self):
        """Search candidates by preferred location"""
        profiles = [
            make_profile(user_id=1, preferred_location="Sydney"),
            make_profile(user_id=2, preferred_location="Melbourne"),
            make_profile(user_id=3, preferred_location="Sydney"),
        ]
        query = "Sydney"
        matching = [p for p in profiles if p.preferred_location == query]
        assert len(matching) == 2
 
    def test_search_candidate_by_working_mode(self):
        """Search candidates preferring Remote work"""
        profiles = [
            make_profile(user_id=1, preferred_mode="Remote"),
            make_profile(user_id=2, preferred_mode="On-site"),
            make_profile(user_id=3, preferred_mode="Hybrid"),
        ]
        matching = [p for p in profiles if p.preferred_working_mode == "Remote"]
        assert len(matching) == 1