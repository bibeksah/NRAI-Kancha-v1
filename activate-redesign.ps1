# NRAI Kancha - Redesign Activation Script
# Run this script to activate the new UI/UX design

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  NRAI Kancha UI/UX Redesign Activation" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "C:\Users\bibek\Desktop\NRAI-Kancha-v1"

# Check if we're in the right directory
if (-not (Test-Path "$projectPath\components")) {
    Write-Host "Error: Components folder not found!" -ForegroundColor Red
    Write-Host "Make sure you're running this from: $projectPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Project directory found" -ForegroundColor Green
Write-Host ""

# Check if new design exists
if (-not (Test-Path "$projectPath\components\chatbot-redesigned.tsx")) {
    Write-Host "Error: Redesigned chatbot component not found!" -ForegroundColor Red
    Write-Host "Expected: $projectPath\components\chatbot-redesigned.tsx" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ New design component found" -ForegroundColor Green
Write-Host ""

# Prompt user for activation method
Write-Host "Choose activation method:" -ForegroundColor Yellow
Write-Host "  1. Replace original (creates backup)" -ForegroundColor White
Write-Host "  2. Keep both (manual import change needed)" -ForegroundColor White
Write-Host "  3. Cancel" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Enter your choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Creating backup of original chatbot..." -ForegroundColor Yellow
        
        if (Test-Path "$projectPath\components\chatbot.tsx") {
            Copy-Item "$projectPath\components\chatbot.tsx" "$projectPath\components\chatbot-old-backup.tsx" -Force
            Write-Host "✓ Backup created: chatbot-old-backup.tsx" -ForegroundColor Green
        }
        
        Write-Host "Activating new design..." -ForegroundColor Yellow
        Copy-Item "$projectPath\components\chatbot-redesigned.tsx" "$projectPath\components\chatbot.tsx" -Force
        Write-Host "✓ New design activated!" -ForegroundColor Green
        Write-Host ""
        Write-Host "================================================" -ForegroundColor Cyan
        Write-Host "  SUCCESS! New design is now active!" -ForegroundColor Green
        Write-Host "================================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "  1. Install dependencies: npm install" -ForegroundColor White
        Write-Host "  2. Start dev server: npm run dev" -ForegroundColor White
        Write-Host "  3. Open: http://localhost:3000" -ForegroundColor White
        Write-Host ""
        Write-Host "To rollback:" -ForegroundColor Yellow
        Write-Host "  Copy-Item components\chatbot-old-backup.tsx components\chatbot.tsx" -ForegroundColor White
    }
    
    "2" {
        Write-Host ""
        Write-Host "Keeping both components." -ForegroundColor Green
        Write-Host ""
        Write-Host "To use the new design, update app/page.tsx:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  Change from:" -ForegroundColor White
        Write-Host "    import { Chatbot } from '@/components/chatbot'" -ForegroundColor Gray
        Write-Host ""
        Write-Host "  To:" -ForegroundColor White
        Write-Host "    import { Chatbot } from '@/components/chatbot-redesigned'" -ForegroundColor Green
        Write-Host ""
    }
    
    "3" {
        Write-Host ""
        Write-Host "Activation cancelled." -ForegroundColor Yellow
        exit 0
    }
    
    default {
        Write-Host ""
        Write-Host "Invalid choice. Activation cancelled." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Documentation available:" -ForegroundColor Cyan
Write-Host "  • QUICK_START.md - Quick activation guide" -ForegroundColor White
Write-Host "  • REDESIGN_SUMMARY.md - Overview of changes" -ForegroundColor White
Write-Host "  • REDESIGN_GUIDE.md - Detailed documentation" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Cyan
