import { isArchitectFn, isProcessorFn, isReaderFn } from '../../attached-fns';
import { Buildable } from '../../buildable';
import { MutationFnReadType } from '../../constants';
import { FaketasticNode } from '../../types';
import { getSymbol } from '../../util';
import { getRawValue } from '../traverser';
import { AttachedFunctionHandler } from './attached-function.handler';
import { MutationFn } from './mutation.fn';

export function handleAttachedFns(node: FaketasticNode<Buildable>): AttachedFunctionHandler {
  const buildable = node.value;
  const attachedFns = {
    getReaderFns: () => buildable.attachedFns.filter(isReaderFn),
    getArchitectFns: () => buildable.attachedFns.filter(isArchitectFn) as MutationFn[],
    getPreprocessors: () =>
      buildable.attachedFns.filter(fn => isProcessorFn(fn, 'prebuild')) as MutationFn[],
    getPostprocessors: () =>
      buildable.attachedFns.filter(fn => isProcessorFn(fn, 'postbuild')) as MutationFn[],
  };

  return {
    runReaderFns,
    runArchitectFns,
    runPreprocessorFns,
    runPostprocessorFns,
  };

  function runReaderFns() {
    const readerFns = attachedFns.getReaderFns();
    readerFns.forEach(fn => fn(node));
  }

  function runArchitectFns() {
    const architectFns = attachedFns.getArchitectFns();
    runPrebuildMutations(architectFns, buildable, node);
  }

  function runPreprocessorFns() {
    const preprocessors = attachedFns.getPreprocessors();
    runPrebuildMutations(preprocessors, buildable, node);
  }

  function runPostprocessorFns() {
    const postprocessors = attachedFns.getPostprocessors();
    let value = getRawValue(buildable.value);

    postprocessors.forEach(fn => {
      value = fn(value);
      value = getRawValue(value);
    });

    node.setValue(value);
  }
}

function runPrebuildMutations(
  mutationFns: MutationFn[],
  buildable: Buildable,
  node: FaketasticNode,
) {
  let currentValue = buildable.value;

  mutationFns.forEach(mutationFn => {
    currentValue = getValueForReadTypeOf(mutationFn, buildable, currentValue);
    currentValue = mutationFn(currentValue);
  });

  buildable.value = currentValue;
  node.setValue(buildable);
}

function getValueForReadTypeOf(fn: MutationFn, buildable: Buildable, value: any): Buildable | any {
  const type = getSymbol(MutationFnReadType, fn);

  switch (type) {
    case 'value':
      return value;
    case 'buildable':
      return buildable;
    default:
      throw new Error(`faketastic: unknown read-type "${type}".`);
  }
}
