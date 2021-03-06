var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var ParticleEmitter = require('./ParticleEmitter');
var Render = require('./ParticleManagerRender');

var ParticleEmitterManager = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Visible,
        Render
    ],

    initialize:

    function ParticleEmitterManager (scene, texture, frame, emitters)
    {
        GameObject.call(this, scene, 'ParticleEmitterManager');

        //  private
        this.blendMode = -1;

        this.timeScale = 1;

        this.texture = null;
        this.frame = null;
        this.frameNames = [];

        this.setTexture(texture, frame);

        //  Array of frame names the emitters are allowed to use

        this.emitters = [];

        if (emitters !== undefined)
        {
            //  An array of emitter configs?
            if (!Array.isArray(emitters))
            {
                emitters = [ emitters ];
            }

            for (var i = 0; i < emitters.length; i++)
            {
                this.createEmitter(emitters[i]);
            }
        }
    },

    setTexture: function (key, frame)
    {
        this.texture = this.scene.sys.textures.get(key);

        return this.setFrame(frame);
    },

    setFrame: function (frame)
    {
        this.frame = this.texture.get(frame);

        this.frameNames = this.texture.getFramesFromTextureSource(this.frame.sourceIndex);

        return this;
    },

    setEmitterFrames: function (frames, emitter)
    {
        if (!Array.isArray(frames))
        {
            frames = [ frames ];
        }

        var out = emitter.frames;

        out.length = 0;

        for (var i = 0; i < frames.length; i++)
        {
            var frame = frames[i];

            if (this.frameNames.indexOf(frame) !== -1)
            {
                out.push(this.texture.get(frame));
            }
        }

        return this;
    },

    addEmitter: function (emitter)
    {
        this.emitters.push(emitter);

        return emitter;
    },

    createEmitter: function (config)
    {
        return this.addEmitter(new ParticleEmitter(this, config));
    },

    pause: function ()
    {
        this.active = false;

        return this;
    },

    resume: function ()
    {
        this.active = true;

        return this;
    },

    preUpdate: function (time, delta)
    {
        //  Scale the delta
        delta *= this.timeScale;

        var emitters = this.emitters;

        for (var i = 0; i < emitters.length; i++)
        {
            var emitter = emitters[i];

            if (emitter.active)
            {
                emitter.preUpdate(time, delta);
            }
        }
    }

});

module.exports = ParticleEmitterManager;
