from sensor.connectors import mysql
from sqlalchemy import Column, Text, Integer, VARCHAR


class Song(mysql.BaseModel):
    __tablename__ = 'songs'

    id = Column(Integer, primary_key=True, autoincrement=True)  # noqa
    lyrics = Column(Text)
    title = Column(VARCHAR)
    filename = Column(VARCHAR)
    track_number = Column(Integer)
    icon = Column(VARCHAR)

    def to_dict(self):
        return dict(
            id=self.id,
            lyrics=self.lyrics,
            title=self.title,
            filename=self.filename,
            track_number=self.track_number,
            icon=self.icon
        )


def get_songs():
    with mysql.purp_db_session() as session:
        query = session.query(Song).order_by(Song.__table__.c.track_number.asc())
        records = query.all()
        return [record.to_dict() for record in records]
