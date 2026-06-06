import yaml from 'js-yaml';
import { ScriptYaml } from './types';

/**
 * Convert a ScriptYaml object to a YAML string.
 */
export function scriptYamlToYamlString(data: ScriptYaml): string {
  return yaml.dump(data, {
    indent: 2,
    lineWidth: -1, // disable line folding
    noRefs: true,
    sortKeys: false,
  });
}

/**
 * Trigger a browser download of a YAML string as a `.yaml` file.
 */
export function downloadYaml(yamlString: string, filename = 'script-output.yaml'): void {
  const blob = new Blob([yamlString], { type: 'application/x-yaml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
