#!/usr/bin/env node

/**
 * Comprehensive Test Runner
 * Orchestrates all test suites and generates reports
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
}

class TestRunner {
  constructor() {
    this.results = {
      unit: null,
      integration: null,
      accessibility: null,
      performance: null,
      e2e: null,
      coverage: null
    }
    this.startTime = Date.now()
  }

  log(message, color = 'white') {
    console.log(`${COLORS[color]}${message}${COLORS.reset}`)
  }

  async runTestSuite(name, command, description) {
    this.log(`\n🧪 Running ${description}...`, 'cyan')
    
    try {
      const output = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe',
        cwd: process.cwd()
      })
      
      this.results[name] = { 
        status: 'PASSED', 
        output,
        duration: this.extractDuration(output)
      }
      
      this.log(`✅ ${description} PASSED`, 'green')
      
    } catch (error) {
      this.results[name] = { 
        status: 'FAILED', 
        error: error.message,
        output: error.stdout
      }
      
      this.log(`❌ ${description} FAILED`, 'red')
      console.log(error.stdout)
      
      if (process.env.FAIL_FAST === 'true') {
        process.exit(1)
      }
    }
  }

  extractDuration(output) {
    const match = output.match(/Tests?\s+(\d+)\s+passed.*?in\s+([\d.]+m?s)/i)
    return match ? match[2] : 'Unknown'
  }

  async runAllTests() {
    this.log('🚀 Starting Comprehensive Test Suite', 'blue')
    this.log('=====================================\n', 'blue')

    // Run unit tests with coverage
    await this.runTestSuite(
      'unit', 
      'npm run test:coverage -- src/tests/unit/',
      'Unit Tests with Coverage'
    )

    // Run integration tests
    await this.runTestSuite(
      'integration',
      'npm run test -- src/tests/integration/',
      'Integration Tests'
    )

    // Run accessibility tests
    await this.runTestSuite(
      'accessibility',
      'npm run test -- src/tests/accessibility/',
      'Accessibility Tests (WCAG 2.1 AA)'
    )

    // Run performance tests
    await this.runTestSuite(
      'performance',
      'npm run test:performance',
      'Performance & Timer Precision Tests'
    )

    // Run E2E tests (cross-browser)
    if (process.env.SKIP_E2E !== 'true') {
      await this.runTestSuite(
        'e2e',
        'npm run test:e2e',
        'End-to-End Cross-Browser Tests'
      )
    }

    this.generateReport()
    this.checkQualityGates()
  }

  generateReport() {
    const totalDuration = Date.now() - this.startTime
    
    this.log('\n📊 TEST EXECUTION REPORT', 'blue')
    this.log('=========================', 'blue')
    
    // Test results summary
    Object.entries(this.results).forEach(([suite, result]) => {
      if (!result) return
      
      const status = result.status === 'PASSED' ? '✅' : '❌'
      const color = result.status === 'PASSED' ? 'green' : 'red'
      const duration = result.duration || 'N/A'
      
      this.log(`${status} ${suite.toUpperCase()}: ${result.status} (${duration})`, color)
    })
    
    // Overall statistics
    const passed = Object.values(this.results).filter(r => r?.status === 'PASSED').length
    const total = Object.values(this.results).filter(r => r).length
    const successRate = Math.round((passed / total) * 100)
    
    this.log(`\n📈 Overall Success Rate: ${successRate}% (${passed}/${total} suites)`, 
      successRate >= 80 ? 'green' : 'red')
    
    this.log(`⏱️  Total Execution Time: ${Math.round(totalDuration / 1000)}s`, 'cyan')
    
    // Save detailed report
    this.saveDetailedReport(totalDuration, successRate)
  }

  saveDetailedReport(totalDuration, successRate) {
    const report = {
      timestamp: new Date().toISOString(),
      totalDuration: totalDuration,
      successRate: successRate,
      suites: this.results,
      environment: {
        node: process.version,
        platform: process.platform,
        ci: !!process.env.CI
      }
    }

    const reportDir = 'test-results'
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true })
    }

    fs.writeFileSync(
      path.join(reportDir, 'test-report.json'),
      JSON.stringify(report, null, 2)
    )

    // Generate HTML report
    this.generateHTMLReport(report)
    
    this.log(`\n📝 Detailed report saved to test-results/`, 'cyan')
  }

  generateHTMLReport(report) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Pomodoro Timer Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .header { background: #f0f0f0; padding: 20px; border-radius: 5px; }
    .suite { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
    .passed { border-color: #28a745; background: #d4edda; }
    .failed { border-color: #dc3545; background: #f8d7da; }
    .stats { display: flex; gap: 20px; margin: 20px 0; }
    .stat { padding: 10px; background: #e9ecef; border-radius: 5px; text-align: center; }
    pre { background: #f8f9fa; padding: 10px; border-radius: 5px; overflow-x: auto; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🍅 Pomodoro Timer Test Report</h1>
    <p>Generated on ${report.timestamp}</p>
    <div class="stats">
      <div class="stat">
        <strong>Success Rate</strong><br>
        ${report.successRate}%
      </div>
      <div class="stat">
        <strong>Total Duration</strong><br>
        ${Math.round(report.totalDuration / 1000)}s
      </div>
      <div class="stat">
        <strong>Environment</strong><br>
        ${report.environment.platform} / Node ${report.environment.node}
      </div>
    </div>
  </div>

  ${Object.entries(report.suites).map(([name, result]) => {
    if (!result) return ''
    
    const className = result.status === 'PASSED' ? 'suite passed' : 'suite failed'
    const icon = result.status === 'PASSED' ? '✅' : '❌'
    
    return `
    <div class="${className}">
      <h2>${icon} ${name.toUpperCase()} Tests</h2>
      <p><strong>Status:</strong> ${result.status}</p>
      ${result.duration ? `<p><strong>Duration:</strong> ${result.duration}</p>` : ''}
      ${result.error ? `<p><strong>Error:</strong> ${result.error}</p>` : ''}
      ${result.output ? `<pre>${result.output}</pre>` : ''}
    </div>
    `
  }).join('')}

</body>
</html>
    `

    fs.writeFileSync('test-results/test-report.html', html)
  }

  checkQualityGates() {
    this.log('\n🚦 QUALITY GATES CHECK', 'yellow')
    this.log('======================', 'yellow')

    const gates = [
      {
        name: 'Unit Tests',
        condition: this.results.unit?.status === 'PASSED',
        required: true
      },
      {
        name: 'Integration Tests', 
        condition: this.results.integration?.status === 'PASSED',
        required: true
      },
      {
        name: 'Accessibility Compliance',
        condition: this.results.accessibility?.status === 'PASSED',
        required: true
      },
      {
        name: 'Performance Tests',
        condition: this.results.performance?.status === 'PASSED',
        required: true
      },
      {
        name: 'Cross-Browser E2E',
        condition: this.results.e2e?.status === 'PASSED' || process.env.SKIP_E2E === 'true',
        required: false
      }
    ]

    let allRequired = true
    let allPassed = true

    gates.forEach(gate => {
      const status = gate.condition ? 'PASS' : 'FAIL'
      const icon = gate.condition ? '✅' : '❌'
      const color = gate.condition ? 'green' : 'red'
      const required = gate.required ? '(Required)' : '(Optional)'

      this.log(`${icon} ${gate.name} ${required}: ${status}`, color)

      if (gate.required && !gate.condition) {
        allRequired = false
      }
      if (!gate.condition) {
        allPassed = false
      }
    })

    this.log('\n🎯 FINAL VERDICT', 'blue')
    this.log('===============', 'blue')

    if (allPassed) {
      this.log('🎉 ALL QUALITY GATES PASSED - Ready for Production!', 'green')
      process.exit(0)
    } else if (allRequired) {
      this.log('✅ REQUIRED QUALITY GATES PASSED - Ready for Staging', 'yellow')
      this.log('⚠️  Some optional tests failed - Consider fixing before production', 'yellow')
      process.exit(0)
    } else {
      this.log('❌ QUALITY GATES FAILED - Not ready for deployment', 'red')
      this.log('🛠️  Fix failing tests before proceeding', 'red')
      process.exit(1)
    }
  }
}

// Run the test suite
const runner = new TestRunner()
runner.runAllTests().catch(error => {
  console.error('Test runner failed:', error)
  process.exit(1)
})