import json
import random
from deepdiff import DeepDiff

import pytz
from datetime import datetime

from sqlalchemy import Column, Integer, Float, DateTime, String, JSON, text
from sqlalchemy.orm import load_only, defer
from sqlalchemy.sql import func

from sensor.connectors import mysql

"""
CREATE TABLE measurement (
    id int(10) unsigned NOT NULL AUTO_INCREMENT,
    timestamp datetime,
    humidity int,
    temperature int,
    pressure float,
    pm_1_0 float,
    pm_2_5 float,
    aqi_2_5 int,
    aqi_cat_2_5 varchar(255),
    aqi_idx_2_5 int,
    pm_10_0 float,
    aqi_10_0 int,
    aqi_cat_10_0 varchar(255),
    aqi_idx_10_0 int,
    um_count_0_3 float,
    um_count_0_5 float,
    um_count_1_0 float,
    um_count_2_5 float,
    um_count_5_0 float,
    um_count_10_0 float,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
"""

"""

DELETE FROM measurement WHERE id IN (
    WITH dups AS (
    SELECT timestamp, id, ROW_NUMBER() OVER (PARTITION by timestamp ORDER BY timestamp) AS row_num
    FROM measurement
        WHERE timestamp IN (
            SELECT timestamp from measurement group by timestamp having count(timestamp) > 1
        )
    )
    SELECT id  FROM dups WHERE row_num = 2
);
"""

DATE_FORMAT = '%m/%d/%Y %I:%M:%S %p'


def timestamp_to_local_date(timestamp):
    est = pytz.timezone('US/Eastern')
    gmt = pytz.timezone('GMT')
    dt = datetime.fromtimestamp(timestamp)
    date_gmt = gmt.localize(dt)
    date_est = date_gmt.astimezone(est)
    return date_est.strftime(DATE_FORMAT)


class Measurement(mysql.BaseModel):
    __tablename__ = 'measurement'

    id = Column(Integer, primary_key=True, autoincrement=True)  # noqa
    timestamp = Column(Integer)
    humidity = Column(Integer)
    pressure = Column(Float)
    temperature = Column(Integer)

    pm_1_0 = Column(Float)

    pm_2_5 = Column(Float)
    aqi_2_5 = Column(Integer)
    aqi_cat_2_5 = Column(String)
    aqi_idx_2_5 = Column(Integer)

    pm_10_0 = Column(Float)
    aqi_10_0 = Column(Integer)
    aqi_cat_10_0 = Column(String)
    aqi_idx_10_0 = Column(Integer)

    um_count_0_3 = Column(Float)
    um_count_0_5 = Column(Float)
    um_count_1_0 = Column(Float)
    um_count_2_5 = Column(Float)
    um_count_5_0 = Column(Float)
    um_count_10_0 = Column(Float)

    stats = Column(JSON)

    def to_dict(self, include_stats=True, format_date=False):
        result = dict(
            id=self.id,
            humidity=self.humidity,
            pressure=round(self.pressure * 0.02953, 4),
            temperature=self.temperature,
            pm1_0=self.pm_1_0,
            pm2_5=self.pm_2_5,
            aqi_2_5=self.aqi_2_5,
            aqi_cat_2_5=self.aqi_cat_2_5,
            aqi_idx_2_5=self.aqi_idx_2_5,
            pm10_0=self.pm_10_0,
            aqi_10_0=self.aqi_10_0,
            aqi_cat_10_0=self.aqi_cat_10_0,
            aqi_idx_10_0=self.aqi_idx_10_0,
            um_count_0_3=self.um_count_0_3,
            um_count_0_5=self.um_count_0_5,
            um_count_1_0=self.um_count_1_0,
            um_count_2_5=self.um_count_2_5,
            um_count_5_0=self.um_count_5_0,
            um_count_10_0=self.um_count_10_0,
        )
        timestamp = self.timestamp
        if format_date:
            timestamp = timestamp_to_local_date(timestamp)
        result['timestamp'] = timestamp
        if include_stats:
            result['stats'] = self.stats
        return result


def create_measurement(data):
    with mysql.purp_db_session() as session:
        query = session.query(Measurement).order_by(Measurement.__table__.c.id.desc())
        record = query.first()
        latest = record.to_dict()
        if latest['timestamp'] == data['timestamp']:
            return latest, False
        measurement = Measurement(**data)
        session.add(measurement)
        session.flush()
        return measurement.to_dict(), True


def latest():
    with mysql.purp_db_session() as session:
        query = session.query(Measurement).order_by(Measurement.__table__.c.id.desc())
        record = query.first()
        output = record.to_dict(include_stats=True, format_date=False)
        return output


def get_trends(count):
    with mysql.purp_db_session() as session:
        # query = session.query(Measurement).options(defer(Measurement.stats))
        # sort_field = Measurement.__table__.c.id.desc()
        # query = query.order_by(sort_field)
        # query = query.limit(count)
        select_params = {
            'hours': 60*60*int(count)
        }
        sql_query = text("""
        SELECT *    
        FROM measurement 
        WHERE timestamp >= UNIX_TIMESTAMP(NOW()) - :hours
        ORDER BY timestamp ASC;
        """)
        rows = session.execute(
            sql_query,
            select_params)

        items = [Measurement(**dict(row)).to_dict(False, False) for row in rows.mappings()]
        return items


def get_top(param, count):
    with mysql.purp_db_session() as session:
        print(param)
        sort_field = Measurement.__table__.c.get(param)
        print(sort_field)
        query = session.query(Measurement).order_by(sort_field.desc())
        query = query.limit(count)
        rows = query.all()
        items = [row.to_dict(False, False) for row in rows]
        return items


def get_by_date(day):
    with mysql.purp_db_session() as session:
        select_params = {
            'day': day
        }
        sql_query = text("""
        SELECT *
        FROM measurement 
        WHERE timestamp >= UNIX_TIMESTAMP(:day) - 60*60*24 AND timestamp < (UNIX_TIMESTAMP(:day))
        ORDER BY timestamp ASC;
        """)
        rows = session.execute(
            sql_query,
            select_params).fetchall()
        return [Measurement(**dict(row)).to_dict(False, False) for row in rows]
