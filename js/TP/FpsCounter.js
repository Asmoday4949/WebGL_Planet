
class FpsCounter
{
    constructor(divFps = null)
    {
        this.divFps = divFps;

        this.startTime = Date.now();
        this.framesCounter = 0;
    }

    setDiv(divFps)
    {
        this.divFps = divFps;
    }

    update()
    {
        ++this.framesCounter;

        let currentTime = Date.now();
        if(currentTime - this.startTime >= 1000)
        {
            if(this.divFps != null)
            {
                this.divFps.innerHTML = "FPS : " + this.framesCounter.toString();
            }

            this.framesCounter = 0;
            this.startTime = currentTime;
        }
    }
}