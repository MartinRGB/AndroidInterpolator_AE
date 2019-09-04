
class SpringAnimationCalculator{
    constructor(stiffness,dampingratio,velocity) {

        this.stiffness = stiffness;
        this.dampingratio = dampingratio;
        this.velocity = velocity;
        this.mass = 1.0;

        // Output
        this.damping = this.computeDamping(stiffness,dampingratio);
        this.tension = this.stiffness;
        this.friction = this.damping;
        this.duration = this.computeDuration(this.tension, this.friction,2);
        this.array = this.springCalculator(this.stiffness,this.dampingratio,this.velocity,this.duration);
        this.durationForUIView = this.computeDuration(this.tension, this.friction,1);
    }

    computeDamping(stiffness,dampingRatio){
        let mass = this.mass;
        return dampingRatio * (2 * Math.sqrt(mass * stiffness));
    }

    computeDampingRatio(tension, friction) {
        let mass = this.mass;
        return friction / (2 * Math.sqrt(mass * tension));
    }

    computeDuration(tension, friction,duration) {
        var durationFactor = duration;
        let epsilon = 0.001/durationFactor;
        let velocity = 0.0;
        let mass = this.mass
        let dampingRatio = this.computeDampingRatio(tension, friction)
        let undampedFrequency = Math.sqrt(tension / mass)
        if (dampingRatio < 1) {
            let a = Math.sqrt(1 - Math.pow(dampingRatio, 2))
            let b = velocity / (a * undampedFrequency)
            let c = dampingRatio / a
            let d = -((b - c) / epsilon)
            if (d <= 0) {
                return 0.0
            }
            console.log(Math.log(d) / (dampingRatio * undampedFrequency))
            return Math.log(d) / (dampingRatio * undampedFrequency)
        } else {
            return 0.0
        }
    }

    springCalculator(stiffness,dampingratio,velocity,duration){
        var transitionArray = [[0,0]];
        var starVal = 0;
        var endVal = 1;
        var mNaturalFreq = Math.sqrt(stiffness);
        var mDampedFreq = mNaturalFreq*Math.sqrt(1.0 - dampingratio* dampingratio);
        var lastVelocity =  velocity;
        var currentVelocity = 0;
        var sampleScale = 1.5;

        for (var i = 1/(60*sampleScale) ;i < duration+10/(60*sampleScale);i += 1/(60*sampleScale)){
            var deltaT = i;
            var lastDisplacement  = i/(5*60) -  endVal;
            var cosCoeff = lastDisplacement;
            var sinCoeff = 1.0 / mDampedFreq * (dampingratio * mNaturalFreq * lastDisplacement + lastVelocity);
            var displacement = Math.pow(Math.E,-dampingratio * mNaturalFreq * deltaT) * (lastDisplacement * Math.cos(mDampedFreq * deltaT) + sinCoeff * Math.sin(mDampedFreq * deltaT));

            var mValue = displacement + endVal;

            //currentVelocity = displacement * (-mNaturalFreq) * dampingratio + Math.pow(Math.E, -dampingratio * mNaturalFreq * deltaT) * (-mDampedFreq * cosCoeff * Math.sin(mDampedFreq * deltaT)+ mDampedFreq * sinCoeff * Math.cos(mDampedFreq * deltaT));

            transitionArray.push([i/(duration+10/(60*sampleScale)),Math.abs(mValue)]);
        }
        return transitionArray;
    }
}