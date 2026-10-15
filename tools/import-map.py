"""Import a pinned FLD2 grid. No artwork or client GRF files are required."""
import gzip
import hashlib
import json
import pathlib
import struct
import urllib.request

SOURCE = 'https://raw.githubusercontent.com/OpenKore/openkore/613bd3e322d18967b761337630b51e5b44a3de07/fields/pay_fild08.fld2.gz'
EXPECTED = '975c884e0ee5afa2c6225ee37df59ed9cdb109a9520593bc8fc958466693155d'

def convert(raw):
    width, height = struct.unpack('<HH', raw[:4])
    if len(raw) != 4 + width * height:
        raise ValueError('Invalid FLD2 dimensions')
    # RO starts at the south-west; our Canvas world starts at the north-west.
    cells = b''.join(raw[4 + y * width:4 + (y + 1) * width] for y in reversed(range(height)))
    runs = []
    for value in cells:
        if runs and runs[-1][1] == value:
            runs[-1][0] += 1
        else:
            runs.append([1, value])
    return dict(id='pay_fild08', name='Payon Forest 08', width=width, height=height,
                tileSize=24, source='https://db.irowiki.org/db/map-info/pay_fild08/',
                navigationSource=SOURCE, navigationSha256=hashlib.sha256(raw).hexdigest(),
                axes='north-west origin; FLD2 rows reversed',
                walkableTiles=sum(bool(v & 1) for v in cells), terrainRle=runs)

if __name__ == '__main__':
    raw = gzip.decompress(urllib.request.urlopen(SOURCE, timeout=45).read())
    if hashlib.sha256(raw).hexdigest() != EXPECTED:
        raise ValueError('Navigation source hash changed')
    data = convert(raw)
    target = pathlib.Path(__file__).resolve().parents[1] / 'data/maps.js'
    target.write_text('// Navigation is imported from OpenKore FLD2; art is a 2D Survivor adaptation.\nwindow.RS_MAPS={pay_fild08:' + json.dumps(data, separators=(',', ':')) + '};\n')
