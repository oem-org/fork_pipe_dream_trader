
backend-1              | INFO  [alembic.runtime.migration] Will assume transactional DDL.
backend-1              | INFO:     Will watch for changes in these directories: ['/app']
backend-1              | INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
backend-1              | INFO:     Started reloader process [8] using StatReload
backend-1              | typing.Annotated[dict, Depends(get_current_user)]
backend-1              | Process SpawnProcess-1:
backend-1              | Traceback (most recent call last):
backend-1              |   File "/usr/local/lib/python3.13/multiprocessing/process.py", line 313, in _bootstrap
backend-1              |     self.run()
backend-1              |     ~~~~~~~~^^
backend-1              |   File "/usr/local/lib/python3.13/multiprocessing/process.py", line 108, in run
backend-1              |     self._target(*self._args, **self._kwargs)
backend-1              |     ~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1              |   File "/usr/local/lib/python3.13/site-packages/uvicorn/_subprocess.py", line 80, in subprocess_started
backend-1              |     target(sockets=sockets)
backend-1              |     ~~~~~~^^^^^^^^^^^^^^^^^
backend-1              |   File "/usr/local/lib/python3.13/site-packages/uvicorn/server.py", line 65, in run
backend-1              |     return asyncio.run(self.serve(sockets=sockets))
backend-1              |            ~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1              |   File "/usr/local/lib/python3.13/asyncio/runners.py", line 194, in run
backend-1              |     return runner.run(main)
backend-1              |            ~~~~~~~~~~^^^^^^
backend-1              |   File "/usr/local/lib/python3.13/asyncio/runners.py", line 118, in run
backend-1              |     return self._loop.run_until_complete(task)
backend-1              |            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^
backend-1              |   File "/usr/local/lib/python3.13/asyncio/base_events.py", line 721, in run_until_complete
backend-1              |     return future.result()
backend-1              |            ~~~~~~~~~~~~~^^
backend-1              |   File "/usr/local/lib/python3.13/site-packages/uvicorn/server.py", line 69, in serve
backend-1              |     await self._serve(sockets)
backend-1              |   File "/usr/local/lib/python3.13/site-packages/uvicorn/server.py", line 76, in _serve
backend-1              |     config.load()
backend-1              |     ~~~~~~~~~~~^^
backend-1              |   File "/usr/local/lib/python3.13/site-packages/uvicorn/config.py", line 434, in load
backend-1              |     self.loaded_app = import_from_string(self.app)
backend-1              |                       ~~~~~~~~~~~~~~~~~~^^^^^^^^^^
backend-1              |   File "/usr/local/lib/python3.13/site-packages/uvicorn/importer.py", line 19, in import_from_string
backend-1              |     module = importlib.import_module(module_str)
backend-1              |   File "/usr/local/lib/python3.13/importlib/__init__.py", line 88, in import_module
backend-1              |     return _bootstrap._gcd_import(name[level:], package, level)
backend-1              |            ~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1              |   File "<frozen importlib._bootstrap>", line 1387, in _gcd_import
backend-1              |   File "<frozen importlib._bootstrap>", line 1360, in _find_and_load
backend-1              |   File "<frozen importlib._bootstrap>", line 1331, in _find_and_load_unlocked
backend-1              |   File "<frozen importlib._bootstrap>", line 935, in _load_unlocked
backend-1              |   File "<frozen importlib._bootstrap_external>", line 1022, in exec_module
backend-1              |   File "<frozen importlib._bootstrap>", line 488, in _call_with_frames_removed
backend-1              |   File "/app/src/main.py", line 9, in <module>
backend-1              |     from .routers.indicators import indicators
backend-1              |   File "/app/src/routers/indicators/indicators.py", line 52, in <module>
backend-1              |     @router.patch("/{indicator_id}", status_code=status.HTTP_200_OK)
backend-1              |      ~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1              |   File "/usr/local/lib/python3.13/site-packages/fastapi/routing.py", line 994, in decorator
backend-1              |     self.add_api_route(
backend-1              |     ~~~~~~~~~~~~~~~~~~^
backend-1              |         path,
backend-1              |         ^^^^^
backend-1              |     ...<23 lines>...
backend-1              |         generate_unique_id_function=generate_unique_id_function,
backend-1              |         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1              |     )
backend-1              |     ^
backend-1              |   File "/usr/local/lib/python3.13/site-packages/fastapi/routing.py", line 933, in add_api_route
backend-1              |     route = route_class(
backend-1              |         self.prefix + path,
backend-1              |     ...<24 lines>...
backend-1              |         generate_unique_id_function=current_generate_unique_id,
backend-1              |     )
backend-1              |   File "/usr/local/lib/python3.13/site-packages/fastapi/routing.py", line 554, in __init__
backend-1              |     self.dependant = get_dependant(path=self.path_format, call=self.endpoint)
backend-1              |                      ~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1              |   File "/usr/local/lib/python3.13/site-packages/fastapi/dependencies/utils.py", line 285, in get_dependant
backend-1              |     param_details = analyze_param(
backend-1              |         param_name=param_name,
backend-1              |     ...<2 lines>...
backend-1              |         is_path_param=is_path_param,
backend-1              |     )
backend-1              |   File "/usr/local/lib/python3.13/site-packages/fastapi/dependencies/utils.py", line 488, in analyze_param
backend-1              |     field = create_model_field(
backend-1              |         name=param_name,
backend-1              |     ...<4 lines>...
backend-1              |         field_info=field_info,
backend-1              |     )
backend-1              |   File "/usr/local/lib/python3.13/site-packages/fastapi/utils.py", line 98, in create_model_field
backend-1              |     raise fastapi.exceptions.FastAPIError(
backend-1              |     ...<7 lines>...
backend-1              |     ) from None
backend-1              | fastapi.exceptions.FastAPIError: Invalid args for response field! Hint: check that <class 'src.routers.indicators.indicators.IndicatorRequest'> is a valid Pydantic field type. If you are using a return type annotation that is not a valid Pydantic field (e.g. Union[Response, dict, None]) you can disable generating the response model from the type annotation with the path operation decorator parameter response_model=None. Read more: https://fastapi.tiangolo.com/tutorial/response-model/
