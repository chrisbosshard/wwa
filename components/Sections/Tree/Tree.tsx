import { cn } from "@/lib/utils";

type Props = {
  balls: {
    x: number;
    y: number;
    zindex: number;
    animation: string;
    image: string;
    size: number;
  }[];
};

const wiggleMap: Record<string, string> = {
  animation1: "animate-wiggle1",
  animation2: "animate-wiggle2",
  animation3: "animate-wiggle3",
};

const glowMap: Record<string, string> = {
  animation1: "animate-glow1",
  animation2: "animate-glow2",
  animation3: "animate-glow3",
};

export const Tree = ({ balls }: Props) => {
  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden bg-[url('/xmas_background.svg')] bg-cover bg-center bg-no-repeat px-6 pt-6 md:px-8 md:pt-8">
      <div className="relative mx-auto max-w-4xl">
        <div className="relative mx-[20%] -mb-[10%] flex max-sm:mx-0">
          {balls.map((ball, index) => (
          <div
            key={index}
            className="absolute inline-block h-[60px] w-[60px] animate-ballFadeIn rounded-full max-[1100px]:h-10 max-[1100px]:w-10 max-[800px]:h-[30px] max-[800px]:w-[30px] max-[700px]:h-[25px] max-[700px]:w-[25px] max-[400px]:h-5 max-[400px]:w-5"
            style={{ left: `${ball.x}%`, top: `${ball.y}%`, zIndex: ball.zindex }}
          >
            <div className={cn("h-full origin-top", wiggleMap[ball.animation])}>
              <div
                className={cn(
                  "absolute left-[10%] top-[10%] h-[80%] w-[80%] rounded-full bg-caritas-red/15 shadow-[0_0_18px_4px_rgba(227,6,19,0.25)]",
                  glowMap[ball.animation],
                )}
                style={{ zIndex: 0 }}
              />
              <img
                src={ball.image}
                className="relative max-h-full max-w-full"
                alt=""
                style={{
                  height: `${ball.size}px`,
                  width: `${ball.size}px`,
                  zIndex: 10,
                }}
              />
            </div>
          </div>
          ))}
          <img src="/baum1.png" className="absolute w-full" alt="" style={{ zIndex: 99 }} />
          <img src="/baum2.png" className="absolute w-full" alt="" style={{ zIndex: 89 }} />
          <img src="/baum3.png" className="absolute w-full" alt="" style={{ zIndex: 79 }} />
          <img src="/baum4.png" className="absolute w-full" alt="" style={{ zIndex: 69 }} />
          <img src="/baum5.png" className="absolute w-full" alt="" style={{ zIndex: 59 }} />
          <img src="/baum6.png" className="absolute w-full" alt="" style={{ zIndex: 49 }} />
          <img src="/baum7.png" className="absolute w-full" alt="" style={{ zIndex: 39 }} />
          <img src="/baum.png" className="w-full" alt="Weihnachtsbaum" />
        </div>
      </div>
    </div>
  );
};
