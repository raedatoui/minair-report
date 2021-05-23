from sensor.connectors import mysql
from sqlalchemy import Column, Integer, VARCHAR


class Video(mysql.BaseModel):
    __tablename__ = 'videos'

    id = Column(Integer, primary_key=True, autoincrement=True)  # noqa
    title = Column(VARCHAR)
    video = Column(VARCHAR)
    poster = Column(VARCHAR)
    path = Column(VARCHAR)

    def to_dict(self):
        return dict(
            id=self.id,
            title=self.title,
            video=self.video,
            poster=self.poster,
            path=self.path
        )


def get_videos():
    with mysql.purp_db_session() as session:
        query = session.query(Video)
        records = query.all()
        return [record.to_dict() for record in records]
