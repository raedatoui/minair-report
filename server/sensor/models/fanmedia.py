from sensor.connectors import mysql
from sqlalchemy import Column, Integer, VARCHAR


class Fanmedia(mysql.BaseModel):
    __tablename__ = 'fanmedia'

    id = Column(Integer, primary_key=True, autoincrement=True)  # noqa
    file = Column(VARCHAR)
    type = Column(VARCHAR)
    submitted_by = Column(VARCHAR)
    order = Column(Integer)
    poster = Column(VARCHAR)

    def to_dict(self):
        return dict(
            id=self.id,
            file=self.file,
            type=self.type,
            submitted_by=self.submitted_by,
            order=self.order,
            poster=self.poster
        )


def get_media():
    with mysql.purp_db_session() as session:
        query = session.query(Fanmedia).order_by(Fanmedia.__table__.c.id.desc())
        records = query.all()
        return [record.to_dict() for record in records]
