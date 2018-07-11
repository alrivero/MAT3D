import tempfile

# Cloud-safe of uuid, so that many cloned servers do not all use the same uuids.
from gluon.utils import web2py_uuid

# Here go your api methods.


@auth.requires_signature()
def get_users():
    print("Entered get_users()")
    users = []
    # Note: Logged-in users see the list of all users.
    if auth.user is not None:
        # Get the row of your own user and display that at the top of the user array
        my_row = db(db.auth_user.email == auth.user.email).select().first()
        t = dict(
            id=my_row.id,
            first_name=my_row.first_name
        )
        users.append(t)

        # Get all the other rows and display the rest of the users
        rows = db(db.auth_user.email != auth.user.email).select()
        for i, r in enumerate(rows):
            t = dict(
                id = r.id,
                first_name = r.first_name
            )
            users.append(t)
    return response.json(dict(
        users=users
    ))


@auth.requires_signature()
def get_user_images():
    print("Entered get_user_images()")
    images = []
    if auth.user is not None:
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


@auth.requires_signature()
def add_image():
    print("Entered add_image()")
    t_id = db.user_images.insert(
        image_url=request.vars.get_url
    )
    t = db.user_images(t_id)
    image = dict(
        image_src=t.image_url
    )
    return response.json(dict(image=image))
