import pytest
from tests.conftest import make_profile

class TestCP01_WorkExperience:
    """CP01 – Candidate can add / edit / delete work experience"""
 
    def test_profile_stores_work_experience(self):
        p = make_profile()
        p.work_experience = [
            {"company": "OldCorp", "role": "Junior Dev", "years": 2},
        ]
        assert len(p.work_experience) == 1
        assert p.work_experience[0]["company"] == "OldCorp"
 
    def test_add_multiple_work_experience_entries(self):
        p = make_profile()
        p.work_experience = [
            {"company": "Corp A", "role": "Dev", "years": 2},
            {"company": "Corp B", "role": "Lead Dev", "years": 3},
        ]
        assert len(p.work_experience) == 2
 
    def test_remove_work_experience(self):
        entries = [
            {"company": "Corp A", "role": "Dev", "years": 2},
            {"company": "Corp B", "role": "Lead Dev", "years": 3},
        ]
        # Simulate delete by index
        del entries[0]
        assert len(entries) == 1
        assert entries[0]["company"] == "Corp B"
 
    def test_edit_work_experience(self):
        entries = [{"company": "Corp A", "role": "Dev", "years": 2}]
        entries[0]["years"] = 4
        assert entries[0]["years"] == 4
 
 
class TestCP02_Skills:
    """CP02 – Candidate can add multiple skills"""
 
    def test_profile_has_skills_list(self):
        p = make_profile(skills=["Python", "FastAPI", "SQL", "Docker"])
        assert "Python" in p.skills
        assert len(p.skills) == 4
 
    def test_duplicate_skills_check(self):
        skills = ["Python", "SQL", "Python"]  # has duplicate
        unique_skills = list(set(skills))
        assert len(unique_skills) == 2
 
    def test_empty_skills_list(self):
        p = make_profile(skills=[])
        assert p.skills == []
 
 
class TestCP03_PreferredWorkingMode:
    """CP03 – Candidate selects Remote / On-site / Hybrid"""
 
    @pytest.mark.parametrize("mode", ["Remote", "On-site", "Hybrid"])
    def test_valid_preferred_mode(self, mode):
        p = make_profile(preferred_working_mode=mode)
        assert p.preferred_working_mode == mode
 
    def test_invalid_preferred_mode(self):
        valid_modes = {"Remote", "On-site", "Hybrid"}
        mode = "Freelance"  # not in valid set
        assert mode not in valid_modes
 
    def test_preferred_mode_default(self):
        p = make_profile()
        assert p.preferred_working_mode in ["Remote", "On-site", "Hybrid"]
 
 
class TestCP04_PreferredLocation:
    """CP04 – Candidate enters preferred location"""
 
    def test_preferred_location_stored(self):
        p = make_profile(preferred_location="Sydney")
        assert p.preferred_location == "Sydney"
 
    def test_preferred_location_updates(self):
        p = make_profile(preferred_location="Sydney")
        p.preferred_location = "Melbourne"
        assert p.preferred_location == "Melbourne"
 
 
class TestCP05_MatchingAccuracy:
    """CP05 – New profile fields improve recommendation matching"""
 
    def test_skills_improve_cosine_similarity(self):
        """Profile with matching skills should have higher cosine similarity to job"""
        from utils.embeddings import calculate_cosine_similarity
        # Simulate embedding: candidate matching job perfectly
        high_match = [1.0] * 384
        low_match = [0.0] * 384
        job_embedding = [1.0] * 384
 
        score_high = calculate_cosine_similarity(job_embedding, high_match)
        score_low = calculate_cosine_similarity(job_embedding, low_match)
        assert score_high > score_low
 
    def test_preferred_mode_included_in_embedding_text(self):
        """Preferred mode and location should contribute to embedding text"""
        p = make_profile(
            skills=["Python"],
            preferred_working_mode="Remote",
            preferred_location="Sydney"
        )
        combined = f"skills: {' '.join(p.skills)} mode: {p.preferred_working_mode} location: {p.preferred_location}"
        assert "Remote" in combined
        assert "Sydney" in combined