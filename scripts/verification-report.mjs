export const REQUIRED_STEPS = ['install', 'lint', 'types', 'build', 'tests'];

export function evaluateReport(report) {
  const failures = [];
  if (!report.testedCommit || !report.testedTree) failures.push('Missing tested revision.');
  if (!report.sourceUnchanged) failures.push('Source commit, tree or tracked files changed.');
  if (!report.cleanupComplete) failures.push('Temporary checkout cleanup incomplete.');
  if (report.error) failures.push(report.error);
  for (const id of REQUIRED_STEPS) {
    const matches = report.steps.filter(step => step.id === id);
    if (matches.length !== 1 || matches[0].status !== 'passed' || matches[0].exitCode !== 0) {
      failures.push(`Required step ${id} did not pass exactly once.`);
    }
  }
  return { passed: failures.length === 0, failures };
}

export function markdownReport(report) {
  return `# Commit verification\n\nTested commit: ${report.testedCommit || 'unavailable'}\nTree: ${report.testedTree || 'unavailable'}\nResult: ${report.passed ? 'passed' : 'failed'}\nNode: ${report.node}\nDependency mode: fresh npm ci in isolated checkout\n\n| Step | Command | Result | Exit |\n| --- | --- | --- | --- |\n${report.steps.map(s => `| ${s.id} | ${s.argv.join(' ')} | ${s.status} | ${s.exitCode ?? 'none'} |`).join('\n')}\n\n${report.failures.map(f => `- ${f}`).join('\n')}\n\nSource unchanged: ${report.sourceUnchanged}. Cleanup complete: ${report.cleanupComplete}.\nThis is author-controlled local evidence, not independent attestation, browser proof or merge authorization. Logs are private until inspected; hashes identify bytes, not correctness.\n`;
}
