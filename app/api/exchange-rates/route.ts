// app/api/exchange-rates/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This is the "Live News Feed" the robot reads
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 3600 } // This tells the robot to check for news every hour
    });
    
    const data = await res.json();
    
    // The robot calculates the PKR to AED (Dubai) and CNY (China) rates
    const pkrRate = data.rates.PKR;
    const aedRate = data.rates.AED;
    const cnyRate = data.rates.CNY;

    return NextResponse.json({
      success: true,
      rates: {
        USD_PKR: pkrRate,
        AED_PKR: (pkrRate / aedRate).toFixed(2), // Cross-rate for Dubai
        CNY_PKR: (pkrRate / cnyRate).toFixed(2), // Cross-rate for China
      },
      updated: data.time_last_update_utc
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'The robot couldn’t hear the news feed' }, { status: 500 });
  }
}
