"""
Name: Zoe Tacderas
UCSC email: stacdera@ucsc.edu
File name: api.py
"""


import tempfile

# Cloud-safe of uuid, so that many cloned servers do not all use the same uuids.
from gluon.utils import web2py_uuid

# Here go your api methods.


def add_matrix():
    t = dict(
        name=request.vars.name,
        row=request.vars.row,
        col=request.vars.col
    )
    return response.json(dict(matrix=t))

def ans_matrix():
    t = dict(
        name="ans",
        row=request.vars.row,
        col=request.vars.col
    )
    return response.json(dict(matrix=t))