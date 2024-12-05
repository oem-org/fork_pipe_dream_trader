import logging
import logging.config
from pathlib import Path

current_directory = Path(__file__).parent
root_folder = current_directory.parent

log_config_path = root_folder / "log.ini"

if not log_config_path.exists():
    raise FileNotFoundError(f"Log configuration file not found: {log_config_path}")

logging.config.fileConfig(log_config_path)

logger = logging.getLogger(__name__)

stream_handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(name)s - %(message)s")
stream_handler.setFormatter(formatter)
logger.addHandler(stream_handler)

logger.setLevel(logging.DEBUG)
