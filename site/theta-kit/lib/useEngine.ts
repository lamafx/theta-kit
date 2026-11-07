'use client';

import { useEffect, useReducer, useRef } from 'react';
import { chargerThree } from './engines/base';

/** Monte un moteur porté : l'état reste dans le moteur, la vue React se redessine à chaque setState. */
export function useEngine<P>(Moteur: new (props: P) => any, props: P) {
  const [, redessiner] = useReducer((x: number) => x + 1, 0);
  const ref = useRef<any>(null);
  if (!ref.current) ref.current = new Moteur(props);
  const moteur = ref.current;
  moteur.props = props;

  useEffect(() => {
    moteur.onChange = redessiner;
    void chargerThree();
    moteur.componentDidMount?.();
    return () => {
      moteur.onChange = null;
      moteur.componentWillUnmount?.();
    };
  }, [moteur]);

  return moteur.renderVals();
}
