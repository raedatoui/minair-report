from sensor.connectors import mysql
from sqlalchemy import Column, Text, Integer, VARCHAR


class Fanfic(mysql.BaseModel):
    __tablename__ = 'fanfic'

    id = Column(Integer, primary_key=True, autoincrement=True)  # noqa
    story = Column(Text)
    chapter = Column(VARCHAR)

    def to_dict(self):
        return dict(
            id=self.id,
            story=self.story,
            chapter=self.chapter
        )


def get_fiction():
    with mysql.purp_db_session() as session:
        query = session.query(Fanfic).order_by(Fanfic.__table__.c.id.asc())
        records = query.all()
        return [record.to_dict() for record in records]
