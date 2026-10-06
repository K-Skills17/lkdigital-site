'use client';

import Island from '../shared/Island';
import { markup, mount } from './page';

export default function App({ config }) {
  return <Island html={markup} mount={mount} props={config} />;
}
