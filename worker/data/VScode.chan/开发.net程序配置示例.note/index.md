---
image: cover.webp
---

## launch.json

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch",
            "type": "coreclr",
            "request": "launch", 
            "preLaunchTask": "build",
            "program": "${workspaceFolder}/Gliese/bin/Debug/net7.0/Gliese.dll",
            "args": [],
            "cwd": "${workspaceFolder}/Gliese", 
            "stopAtEntry": false,
            "targetArchitecture": "x86_64",
            "env": {
                "ASPNETCORE_ENVIRONMENT": "Development"
            }, 
            "console": "integratedTerminal"
        },
        {
            "name": "Watch",
            "type": "coreclr",
            "request": "launch", 
            "preLaunchTask": "watch",
            "program": "${workspaceFolder}/Gliese/bin/Debug/net7.0/Gliese.dll",
            "args": [],
            "cwd": "${workspaceFolder}/Gliese", 
            "stopAtEntry": false,
            "targetArchitecture": "x86_64",
            "env": {
                "ASPNETCORE_ENVIRONMENT": "Development"
            }, 
            "console": "integratedTerminal"
        },
        {
            "name": ".NET Core Attach",
            "type": "coreclr",
            "request": "attach",
            "processId": "${command:pickProcess}"
        }
    ]
}
```

## tasks.json

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "build",
            "command": "dotnet",
            "type": "process",
            "args": [
                "build",
                "${workspaceFolder}/Gliese/Gliese.csproj",
                "/property:GenerateFullPaths=true",
                "/consoleloggerparameters:NoSummary"
            ],
            "problemMatcher": "$msCompile"
        },
        {
            "label": "publish",
            "command": "dotnet",
            "type": "process",
            "args": [
                "publish",
                "${workspaceFolder}/Gliese/Gliese.csproj",
                "/property:GenerateFullPaths=true",
                "/consoleloggerparameters:NoSummary"
            ],
            "problemMatcher": "$msCompile"
        },
        {
            "label": "watch",
            "command": "dotnet",
            "type": "process",
            "args": [
                "watch",
                "run",
                "--project",
                "${workspaceFolder}/Gliese/Gliese.csproj",
                "/property:GenerateFullPaths=true",
                "/consoleloggerparameters:NoSummary"
            ],
            "problemMatcher": "$msCompile",
            "options": {
                "cwd": "${workspaceFolder}/Gliese/"
            }
        }
    ]
}
```
