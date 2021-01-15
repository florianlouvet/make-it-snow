class SnowFlake {
    constructor(container_width, container_height) {
        this.x = 0;
        this.y = 0;
        this.r = 0;
        this.vx = 0;
        this.vy = 0;
        this.alpha = 0;
        this.container_width = container_width;
        this.container_height = container_height;
        this.reset();
    }

    reset() {
        this.x = this.randBetween(0, this.container_width);
        this.y = this.randBetween(0, -this.container_height);
        this.vx = this.randBetween(-3, 3);
        this.vy = this.randBetween(2, 5);
        this.r = this.randBetween(1, 4);
        this.alpha = this.randBetween(0.1, 0.9);
    }

    randBetween(min, max) {
        return min + Math.random() * (max - min);
    }

    updateSize(width, height) {
        this.container_width = width;
        this.container_height = height;
    }

    update () {
        this.x += this.vx;
        this.y += this.vy;

        if ((this.y + this.r) > this.container_height) {
            this.reset();
        }
    }
};

export function makeItSnow(node) {

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let width = null;
    let height = null;

    let dpr = window.devicePixelRatio || 1;
    let snowflakes = [];

    canvas.className = "snow-canvas";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = 12;
    canvas.style.boxSizing = "border-box";

    node.style.position = "relative";
    node.appendChild(canvas);

    function reSize(entries) {
        for (let entry of entries) {
            width = entry.target.clientWidth;
            height = entry.target.clientHeight;
            canvas.setAttribute("width", `${width * dpr}px`);
            canvas.setAttribute("height", `${height * dpr}px`);
            ctx.scale(dpr, dpr);
            for (const flake of snowflakes) {
                flake.updateSize(width, height);
            }
        }
    };

    function crateSnowflakes() {
        const flakes = (node.clientWidth / 4) * (node.clientHeight / 300);
        for (let s = 0; s < flakes; s++) {
            snowflakes.push(new SnowFlake(node.clientWidth, node.clientHeight));
        }
    }

    function update() {
        ctx.clearRect(0, 0, width, height);
        for (const flake of snowflakes) {
            flake.update();
            ctx.save();
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
            ctx.closePath();
            ctx.globalAlpha = flake.alpha;
            ctx.fill();
            ctx.restore();
        }
        requestAnimationFrame(update);
    };

    const ro = new ResizeObserver(reSize);
    ro.observe(node);

    requestAnimationFrame(update);

    crateSnowflakes();

    return {
	destroy() {
	    snowflakes = [];
	    canvas.remove();
	    ro.disconnect();
	}
    };
};
