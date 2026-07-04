// TYPES
type Props = {
  className?: string;
  balls: {
    x: number;
    y: number;
    zindex: number;
    animation: string;
    image: string;
    size: number;
  }[];
};

// *****************************************************
// IMAGE LINK COMPONENT
// *****************************************************
export const Tree = (props: Props) => {
  // PROPS
  const { balls } = props;

  // *****************************************************

  // RENDER
  return (
    <div className="tree">
      {balls.map((ball, index) => {
        return (
          <div key={index} className="ball" style={{ left: ball.x + "%", top: ball.y + "%", zIndex: ball.zindex }}>
            <div className={"origin-top h-full " + ball.animation + "Container"}>
              <div
                className={"ballGlow " + ball.animation}
                style={{
                  zIndex: 0,
                }}
              />
              <img
                src={ball.image}
                className="ballImage"
                alt="baum"
                style={{
                  height: ball.size + "px",
                  width: ball.size + "px",
                  zIndex: 10,
                }}
              />
            </div>
          </div>
        );
      })}
      <img src="/baum1.png" className="treeOverlay" alt="baum" style={{ zIndex: 99 }} />
      <img src="/baum2.png" className="treeOverlay" alt="baum" style={{ zIndex: 89 }} />
      <img src="/baum3.png" className="treeOverlay" alt="baum" style={{ zIndex: 79 }} />
      <img src="/baum4.png" className="treeOverlay" alt="baum" style={{ zIndex: 69 }} />
      <img src="/baum5.png" className="treeOverlay" alt="baum" style={{ zIndex: 59 }} />
      <img src="/baum6.png" className="treeOverlay" alt="baum" style={{ zIndex: 49 }} />
      <img src="/baum7.png" className="treeOverlay" alt="baum" style={{ zIndex: 39 }} />
      <img src="/baum.png" alt="baum" />
    </div>
  );
};
