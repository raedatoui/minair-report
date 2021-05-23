from sensor.models import fanfic
from sensor.models import fanmedia
from sensor.models import song
from sensor.models import video


def get_fiction():
    return fanfic.get_fiction()


def get_media():
    return fanmedia.get_media()


def get_songs():
    return song.get_songs()


def get_videos():
    return video.get_videos()