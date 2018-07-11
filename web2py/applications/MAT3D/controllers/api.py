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
    return response.json(returnmessage="Received string.")

def get_matrix():
    matrices = []

    request.vars.self_page = True





    images = []

    # Get a list of the images of the user selected
    if auth.user.id == long(request.vars.user_id):
        request.vars.self_page = True
    else:
        request.vars.self_page = False

    # Sort the user's 20 most recent images first
    rows = db(db.user_images.created_by == request.vars.user_id).select(orderby=~db.user_images.created_on,
                                                                        limitby=(0, 20))
    for i, r in enumerate(rows):
        t = dict(
            image_src=r.image_url
        )
        images.append(t)

    return response.json(dict(
        images=images,
        self_page=request.vars.self_page
    ))
