import test from 'node:test';
import assert from 'node:assert/strict';
import { ASSESSMENT_CATEGORIES } from '../lib/assessment-config.js';
import { getMaturityLevel, scoreAssessment } from '../lib/scoring.js';

const questions = ASSESSMENT_CATEGORIES.flatMap(category => category.questions);
const all = value => Object.fromEntries(questions.map(question => [question.id, value]));

test('empty has no score, maturity, archetype or ranked readiness evidence', () => {
  for (const responses of [{}, { sv1: null }, { sv1: undefined }]) {
    const result = scoreAssessment(responses);
    assert.equal(result.answeredCount, 0);
    assert.equal(result.overallScore, null);
    assert.equal(result.maturity, null);
    assert.equal(result.archetype, null);
    assert.deepEqual(result.strongest, []);
    assert.deepEqual(result.weakest, []);
    assert.equal(result.completionRatio, 0);
  }
});
test('one lowest answer is a scored partial assessment, not empty', () => {
  const result = scoreAssessment({ sv1: 1 });
  assert.equal(result.overallScore, 0);
  assert.equal(result.answeredCount, 1);
  assert.equal(result.maturity.key, 'unprepared');
  assert.equal(result.completionRatio, 1 / 39);
});
test('all 39 lowest answers yield 0/100 Unprepared', () => {
  assert.equal(questions.length, 39);
  const result = scoreAssessment(all(1));
  assert.equal(result.overallScore, 0);
  assert.equal(result.maturity.key, 'unprepared');
  assert.equal(result.completionRatio, 1);
});
test('all Not sure answers retain conservative calculation', () => {
  const result = scoreAssessment(all('not_sure'));
  assert.equal(result.overallScore, 34);
  assert.equal(result.maturity.key, 'early');
  assert.equal(result.answeredCount, 39);
});
test('partial scores keep original weighted average without normalizing empty categories', () => {
  assert.equal(scoreAssessment({ sv1: 5 }).overallScore, 15);
  assert.equal(scoreAssessment({ sv1: 1, sv2: 5 }).overallScore, 8);
  assert.equal(scoreAssessment({ sv1: 'not_sure' }).overallScore, 6);
});
test('all strongest answers remain 100 Leading', () => {
  const result = scoreAssessment(all(5));
  assert.equal(result.overallScore, 100);
  assert.equal(result.maturity.key, 'leading');
});
for (const [score, tier] of [[0,'unprepared'],[1,'unprepared'],[24,'unprepared'],[25,'early'],[49,'early'],[50,'emerging'],[69,'emerging'],[70,'capable'],[84,'capable'],[85,'leading'],[100,'leading']]) {
  test(`tier boundary ${score}: ${tier}`, () => assert.equal(getMaturityLevel(score).key, tier));
}
