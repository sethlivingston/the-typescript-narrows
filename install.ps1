$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SkillSrc = Join-Path $ScriptDir "plugin/the-typescript-narrows/skills/typescript-narrows"

$Runtime = if ($args.Count -gt 0) { $args[0] } else { "both" }

if ($Runtime -notmatch "^(claude|copilot|both)$") {
    Write-Host "Usage: .\install.ps1 [claude|copilot|both]"
    Write-Host ""
    Write-Host "  claude   Install to `$env:USERPROFILE\.claude\skills only"
    Write-Host "  copilot  Install to `$env:USERPROFILE\.copilot\skills only"
    Write-Host "  both     Install to both locations (default)"
    exit 1
}

if (-not (Test-Path $SkillSrc -PathType Container)) {
    Write-Error "Error: skill directory not found at $SkillSrc"
    exit 1
}

function Install-ToDestination {
    param(
        [string]$DestinationName,
        [string]$SkillsDst
    )

    if (-not (Test-Path $SkillsDst)) {
        New-Item -ItemType Directory -Path $SkillsDst -Force | Out-Null
    }

    $target = Join-Path $SkillsDst "typescript-narrows"

    if (Test-Path $target) {
        Remove-Item -Recurse -Force $target
    }

    Copy-Item -Recurse $SkillSrc $target

    Write-Host "Installed typescript-narrows to $DestinationName"
    Write-Host "Done. Skill installed to $target"
}

Write-Host "Installing TypeScript Narrows skill to runtime: $Runtime"
Write-Host ""

switch ($Runtime) {
    "claude" {
        $ClaudeSkills = Join-Path $env:USERPROFILE ".claude\skills"
        Install-ToDestination "Claude" $ClaudeSkills
    }
    "copilot" {
        $CopilotSkills = Join-Path $env:USERPROFILE ".copilot\skills"
        Install-ToDestination "Copilot" $CopilotSkills
    }
    "both" {
        $ClaudeSkills = Join-Path $env:USERPROFILE ".claude\skills"
        $CopilotSkills = Join-Path $env:USERPROFILE ".copilot\skills"
        Install-ToDestination "Claude" $ClaudeSkills
        Write-Host ""
        Install-ToDestination "Copilot" $CopilotSkills
    }
}
