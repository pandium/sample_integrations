import sys
from pathlib import Path

# Belt-and-suspenders (pytest.ini already sets pythonpath): make the project root
# importable so `import sb2gorgias` works however pytest is invoked.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
