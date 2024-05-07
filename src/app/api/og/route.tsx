import { ImageResponse } from 'next/og';
import { CSSProperties } from 'react';
import { NextRequest } from 'next/server';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

type Result = {
  username: string;
  score: number;
}
 
export async function GET(req: NextRequest) {
  const fontData = await fs.promises.readFile(path.join(fileURLToPath(import.meta.url), "../../../../../assets/JetBrainsMonoNerdFont-Bold.ttf"));
  
  const { searchParams } = new URL(req.url ?? "", "http://localhost");
  const apiUrl = searchParams.get("apiUrl") ?? "";
  
  const result: Result[] = await fetch(decodeURIComponent(apiUrl), { next: { revalidate: 0 } }).then(r => r.json()).catch(console.error);
  
  const estimatedHeight = 100 + result.length * 50 + 100;
  

  const tableRow = result.map(({ username, score }: Result, index: number) => <div key={ index } style={ row }>
    <div style={{ ...column, ...usernameColumn, ...{ fontSize: 25, paddingLeft: 50 } }}>{ username }</div>
    <div style={{ ...column, ...scoreColumn, ...{ fontSize: 25 } }}>{ score }</div>
  </div>)
  

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 30,
          color: 'white',
          backgroundColor: "black",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: 'center',
          fontFamily: "JetBrainsMono NF",
          justifyContent: 'center'
        }}
      >
        <div style={ row }>
          <div style={{ ...column, ...usernameColumn, ...{ color: "darkorange" } }}>Username</div>
          <div style={{ ...column, ...scoreColumn, ...{ color: "darkorange" } }}>Score</div>
        </div>
        { tableRow }
        <div style={{ fontSize: 20, marginTop: 20, color: "rgb(0, 183, 255)" }}>Top Contributors</div> 
      </div>
    ),
    {
      width: 600,
      height: estimatedHeight,
      fonts: [
        {
          data: fontData,
          name: "JetBrainsMono NF Bold",
          style: "normal"
        }
      ]
    }
  );
}

const row: CSSProperties = {
  display: 'flex',
  width: '100%'
};

const column: CSSProperties = {
  display: "flex",
  padding: 10,
  paddingRight: 20,
  flex: 1,
  textWrap: "wrap",
  wordBreak: "break-all"
};

const usernameColumn: CSSProperties = {
  minWidth: 300,
  paddingLeft: 40,
};

const scoreColumn: CSSProperties = {
  justifyContent: 'center',
  textAlign: 'center',
};