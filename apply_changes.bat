@echo off
REM ============================================
REM Apply route optimization changes to your repo
REM ============================================
REM 
REM USAGE:
REM   1. Find your cloned Infosys-Neurofleetx repo path
REM   2. Run: apply_changes.bat "C:\path\to\your\Infosys-Neurofleetx"
REM

SET REPO_PATH=%~1

if "%REPO_PATH%"=="" (
    echo.
    echo USAGE: apply_changes.bat "C:\path\to\your\Infosys-Neurofleetx"
    echo.
    echo Example: apply_changes.bat "C:\Users\RAKASRI L\Projects\Infosys-Neurofleetx"
    echo.
    exit /b 1
)

if not exist "%REPO_PATH%" (
    echo ERROR: Path "%REPO_PATH%" does not exist.
    exit /b 1
)

echo.
echo Copying backend files...
echo.

copy /Y "neurofleetx-backend\src\main\java\ai\neurofleetx\dto\RouteRequest.java" "%REPO_PATH%\neurofleetx-backend\src\main\java\ai\neurofleetx\dto\RouteRequest.java"
copy /Y "neurofleetx-backend\src\main\java\ai\neurofleetx\repository\RoadNetworkRepository.java" "%REPO_PATH%\neurofleetx-backend\src\main\java\ai\neurofleetx\repository\RoadNetworkRepository.java"
copy /Y "neurofleetx-backend\src\main\java\ai\neurofleetx\service\RouteService.java" "%REPO_PATH%\neurofleetx-backend\src\main\java\ai\neurofleetx\service\RouteService.java"
copy /Y "neurofleetx-backend\src\main\java\ai\neurofleetx\controller\RouteController.java" "%REPO_PATH%\neurofleetx-backend\src\main\java\ai\neurofleetx\controller\RouteController.java"
copy /Y "neurofleetx-backend\src\main\java\ai\neurofleetx\controller\AdminController.java" "%REPO_PATH%\neurofleetx-backend\src\main\java\ai\neurofleetx\controller\AdminController.java"
copy /Y "neurofleetx-backend\src\main\java\ai\neurofleetx\config\DataInitializer.java" "%REPO_PATH%\neurofleetx-backend\src\main\java\ai\neurofleetx\config\DataInitializer.java"

echo.
echo Copying frontend files...
echo.

copy /Y "neurofleetx-frontend\src\pages\RouteOptimization.js" "%REPO_PATH%\neurofleetx-frontend\src\pages\RouteOptimization.js"
copy /Y "neurofleetx-frontend\src\pages\AdminRoadNetwork.js" "%REPO_PATH%\neurofleetx-frontend\src\pages\AdminRoadNetwork.js"
copy /Y "neurofleetx-frontend\src\components\AdminSidebar.js" "%REPO_PATH%\neurofleetx-frontend\src\components\AdminSidebar.js"
copy /Y "neurofleetx-frontend\src\App.js" "%REPO_PATH%\neurofleetx-frontend\src\App.js"

echo.
echo ============================================
echo All files copied successfully!
echo ============================================
echo.
echo Next steps:
echo   cd "%REPO_PATH%"
echo   git add .
echo   git commit -m "feat: dynamic route optimization with OSRM fallback"
echo   git push origin main
echo.
echo Then redeploy on Render (auto-deploys if enabled).
echo.
