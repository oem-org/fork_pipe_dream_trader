export function splitPairName(pair: string | undefined): string  {
    if (pair !== undefined) {

    const parts = pair.split('USDT');
    return parts.join('/USDT');
    }
    return '';
  }