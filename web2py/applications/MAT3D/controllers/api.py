import tempfile

# Cloud-safe of uuid, so that many cloned servers do not all use the same uuids.
from gluon.utils import web2py_uuid

# Here go your api methods.

def add_matrix():
    t = dict(
        name=request.vars.name,
        row=request.vars.row,
        col=request.vars.col,
        matrix_id=request.vars.matrix_id
    )
    return response.json(dict(matrix=t))

def parse_string():
    # just testing if it went into api
    t = request.vars.parser_text
    # parsing logic goes here

    return response.json(dict(returnmessage='Input Received: '+ t))

def get_matrix():
    matrices = []
    request.vars.self_page = True

    return response.json(dict(
        matrices=matrices,
        self_page=request.vars.self_page
    ))
