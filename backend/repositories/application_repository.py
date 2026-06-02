from models.application import Application
from sqlalchemy import select


class ApplicationRepository:
    def __init__(self, db):
        self.db = db

    def get_all(self) -> list[Application]:
        return self.db.execute(select(Application)).scalars().all()

    def get_by_id(self, id: int) -> Application:
        return self.db.execute(select(Application).where(Application.id == id)).scalars().first()

    def get_by_user(self, user_id: int) -> list[Application]:
        return self.db.execute(select(Application).where(Application.user_id == user_id)).scalars().all()

    def get_by_job(self, job_id: int) -> list[Application]:
        return self.db.execute(select(Application).where(Application.job_id == job_id)).scalars().all()

    def get_application_by_user_and_job(self, user_id: int, job_id: int) -> Application:
        return self.db.execute(
            select(Application).where(
                (Application.user_id == user_id) & (Application.job_id == job_id)
            )
        ).scalars().first()

    def save(self, application_data: dict) -> Application:
        application = Application(**application_data)
        self.db.add(application)
        self.db.commit()
        self.db.refresh(application)
        return application

    def update_status(self, id: int, status: str) -> Application:
        application = self.get_by_id(id)
        if not application:
            return None
        application.status = status
        self.db.commit()
        self.db.refresh(application)
        return application

    def delete(self, id: int) -> Application:
        application = self.get_by_id(id)
        if not application:
            return None
        self.db.delete(application)
        self.db.commit()
        return application

    def exists(self, user_id: int, job_id: int) -> bool:
        return (
            self.db.execute(
                select(Application).where(
                    (Application.user_id == user_id) & (Application.job_id == job_id)
                )
            )
            .scalars()
            .first()
            is not None
        )
