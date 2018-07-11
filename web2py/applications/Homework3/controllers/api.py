import tempfile

# Here go your api methods.

# To do:
# Form checking (check that the form is not empty when a new memo is added)
# User checking
# Sharing

# Let us have a serious implementation now.


def get_memos():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    memos = []
    has_more = False
    # Note: Logged-in users see the list of all public memos, and of all of their own private memos.
    if auth.user is not None:
        rows = db(((db.checklist.user_email == auth.user.email) & (db.checklist.is_public == False)) |
                       (db.checklist.is_public == True)).select(limitby=(start_idx, end_idx + 1))
    else:
        rows = db(db.checklist.is_public == True).select(limitby=(start_idx, end_idx + 1))
    for i, r in enumerate(rows):
        if i < end_idx - start_idx:
            # Check if I have a memo or not.
            t = dict(
                id = r.id,
                user_email = r.user_email,
                title = r.title,
                memo = r.memo,
                updated_on = r.updated_on,
                is_public = r.is_public
            )
            memos.append(t)
        else:
            has_more = True
    logged_in = auth.user is not None
    return response.json(dict(
        memos=memos,
        logged_in=logged_in,
        has_more=has_more,
    ))


@auth.requires_signature()
def add_memo():
    t_id = db.checklist.insert(
        title = request.vars.title,
        memo = request.vars.memo,
        updated_on = datetime.datetime.utcnow()
    )
    t = db.checklist(t_id)
    return response.json(dict(memo=t))


@auth.requires_signature()
def delete_memo():
    # Deletes a memo from the table
    db(db.checklist.id == request.vars.memo_id).delete()
    return "ok"


@auth.requires_signature()
def edit_memo():
    if request.vars.memo_id is not None:
        q = ((db.checklist.user_email == auth.user.email) &
             (db.checklist.id == request.vars.memo_id))
        cl = db(q).select().first()
        if cl is not None:
            cl.title = request.vars.title
            cl.memo = request.vars.memo
            cl.update_record()  # saves above change
    return "ok"


@auth.requires_signature()
def toggle_visibility():
    if request.vars.memo_id is not None:
        q = ((db.checklist.user_email == auth.user.email) &
             (db.checklist.id == request.vars.memo_id))
        cl = db(q).select().first()
        if cl is not None:
            if cl.is_public == True:
                cl.is_public = False
            else:
                cl.is_public = True
            cl.update_record()  # saves above change
    return "ok"

