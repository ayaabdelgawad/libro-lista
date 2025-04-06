
def get_json_and_check_fields(req, required_fields=[], optional_fields=[]):
    if req.is_json:
        json = req.get_json()
        # check all required fields are there
        for field in required_fields:
            if field not in json.keys():
                raise Exception(field + ' is a required field in the JSON body')
        # fill in any optional fields with None if missing
        for field in optional_fields:
            if field not in json.keys():
                json[field] = None
        return json
    else:
        raise Exception("request body must be a json")    