import { useEffect, useRef, useState } from "react"

interface PolyInterface {
    colors: string[],
    settings: {
        duration: number, 
        maxCycles: number,
        soundEnabled: boolean, 
        pulseEnabled: boolean,
        instrument: string,
        volume: number
    },
    muteVolume : () => void
}

export const Poly = ({colors, settings, muteVolume} : PolyInterface) => {
    const polyRef = useRef<HTMLCanvasElement>(null) 
    const penRef = useRef<CanvasRenderingContext2D | null>(null);
    const [startTime, setStartTime] = useState<number>(new Date().getTime());
    const keysRef = useRef<HTMLAudioElement[] | null>(null); // Ref to store the audio elements

    console.log("rerender", settings)

    useEffect(() => {
        const canvas = polyRef.current;
        if (canvas) {
            penRef.current = canvas.getContext("2d");
        }

        console.log("rerendered poly initial")

        const getUrl = (index : number) => `/soft/soft_${index}.mp3`;

        setStartTime(new Date().getTime())

        keysRef.current = colors.map((_, index) => {
            // console.log(getUrl(index))
            const audio = new Audio(getUrl(index + 1));
            
            audio.volume = 0.15;
            
            return audio;
        });
    }, [colors]);    

    const calculateVelocity = (index : number) => {  
        const numberOfCycles = settings.maxCycles - index
        const distancePerCycle = 2 * Math.PI;
      
      return (numberOfCycles * distancePerCycle) / settings.duration;
    }

    const calculateNextImpactTime = (currentImpactTime : number, velocity : number) => {
        return currentImpactTime + (Math.PI / velocity) * 1000;
    }

    const calculateDynamicOpacity = (
        currentTime : number, 
        lastImpactTime : number, 
        baseOpacity : number, 
        maxOpacity : number, 
        duration: number) => {
        const timeSinceImpact = currentTime - lastImpactTime
        const percentage = Math.min(timeSinceImpact / duration, 1)
        const opacityDelta = maxOpacity - baseOpacity;
        
        return maxOpacity - (opacityDelta * percentage);
    }

    const determineOpacity = (
        currentTime : number, 
        lastImpactTime : number, 
        baseOpacity : number, 
        maxOpacity : number, 
        duration : number) => {
        if(!settings.pulseEnabled) return baseOpacity;
        
        return calculateDynamicOpacity(currentTime, lastImpactTime, baseOpacity, maxOpacity, duration);
    }

    const calculatePositionOnArc = (center : {x: number, y :number}, radius : number, angle : number) => ({
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle)
    });


    const drawArc = (
        x : number, 
        y : number, 
        radius : number, 
        start : number, 
        end : number, 
        action = "stroke") => {
            const pen = penRef.current;
            if (!pen) return;
            pen.beginPath();
            
            pen.arc(x, y, radius, start, end);
            
            if(action === "stroke") pen.stroke();    
            else pen.fill();
    }

    
    const drawPointOnArc = (center: {x: number, y: number}, arcRadius : number, pointRadius : number, angle : number) => {
        const position = calculatePositionOnArc(center, arcRadius, angle);
        drawArc(position.x, position.y, pointRadius, 0, 2 * Math.PI, "fill");    
    }

    useEffect(() => {
        document.addEventListener('visibilitychange', muteVolume);
        return () => {
            document.removeEventListener('visibilitychange', muteVolume)
        }
    })

    const playKey = (index: number) => {
        if (!keysRef.current) return;
        keysRef.current[index].play();
    }

    const [arcState, setArcState] = useState<any[]>([])

    useEffect(() => {
        const polyRhythm = polyRef.current
        const pen = penRef.current;
        let arcs: any[] = [];
        if (!polyRhythm || !pen) return;
        const init = () => {
            pen.lineCap = "round";
            
            arcs = colors.map((color, index) => {
                const velocity = calculateVelocity(index),
                    lastImpactTime = 0,
                    nextImpactTime = calculateNextImpactTime(startTime, velocity);
            
                return {
                color,
                velocity,
                lastImpactTime,
                nextImpactTime
                }
            });
            console.log(arcs)
            setArcState(arcs)
        }
        init()
    }, [colors])

    useEffect(() => {
        const polyRhythm = polyRef.current
        const pen = penRef.current;
        let animationFrameId: number;

        if (!polyRhythm || !pen) return;


        const draw = () => { // Definitely not optimized

            polyRhythm.width = polyRhythm.clientWidth;
            polyRhythm.height = polyRhythm.clientHeight;
          
            const currentTime = new Date().getTime(),
                  elapsedTime = (currentTime - startTime) / 1000;
            
            const length = Math.min(polyRhythm.width, polyRhythm.height) * 0.9,
                  offset = (polyRhythm.width - length) / 2;
            
            const start = {
              x: offset,
              y: polyRhythm.height / 2
            }
          
            const end = {
              x: polyRhythm.width - offset,
              y: polyRhythm.height / 2
            }
          
            const center = {
              x: polyRhythm.width / 2,
              y: polyRhythm.height / 2
            }
            
          
            const base = {
              length: end.x - start.x,
              minAngle: 0,
              startAngle: 0,
              maxAngle: 2 * Math.PI,
              initialRadius : 0,
              circleRadius : 0,
              clearance : 0,
              spacing : 0,
            }
          
            base.initialRadius = base.length * 0.05;
            base.circleRadius = base.length * 0.006;
            base.clearance = base.length * 0.03;
            base.spacing = (base.length - base.initialRadius - base.clearance) / 2 / colors.length;
          
            arcState.forEach((arc, index) => {
              const radius = base.initialRadius + (base.spacing * index);
          
              // Draw arcs
              pen.globalAlpha = determineOpacity(currentTime, arc.lastImpactTime, 0.15, 0.65, 1000);
              pen.lineWidth = base.length * 0.002;
              pen.strokeStyle = arc.color;
              
              const offset = base.circleRadius * (5 / 3) / radius;
              
              drawArc(center.x, center.y, radius, Math.PI + offset, (2 * Math.PI) - offset);
              
              drawArc(center.x, center.y, radius, offset, Math.PI - offset);
              
              // Draw impact points
              pen.globalAlpha = determineOpacity(currentTime, arc.lastImpactTime, 0.15, 0.85, 1000);
              pen.fillStyle = arc.color;
              
              drawPointOnArc(center, radius, base.circleRadius * 0.75, Math.PI);
              
              drawPointOnArc(center, radius, base.circleRadius * 0.75, 2 * Math.PI);
              
              // Draw moving circles
              pen.globalAlpha = 1;
              pen.fillStyle = arc.color;
              
              if(currentTime >= arc.nextImpactTime) {      
                if(settings.soundEnabled) {
                  playKey(index)
                  arc.lastImpactTime = arc.nextImpactTime;
                }
                
                arc.nextImpactTime = calculateNextImpactTime(arc.nextImpactTime, arc.velocity);      
              }
              
              const distance = elapsedTime >= 0 ? (elapsedTime * arc.velocity) : 0,
                    angle = (Math.PI + distance) % base.maxAngle;
              
              drawPointOnArc(center, radius, base.circleRadius, angle);
            });
            
            animationFrameId = requestAnimationFrame(draw);
          }
        draw()

        return () => {
            cancelAnimationFrame(animationFrameId);
        }
    }, [settings, arcState])

    return (
        <canvas id="polyrhythm" ref={polyRef}>
        </canvas>
    )
}