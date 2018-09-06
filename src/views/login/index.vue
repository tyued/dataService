<template>
  <div class="login-container">
    <div id="canvascontainer" ref='can'></div>
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">
      <h3 class="title">系统登录</h3>
      <div class="login-tip">{{loginTip}}</div>
      <el-form-item prop="username">
        <span class="svg-container username-icon">
        </span>
        <el-input clearable :maxlength="50" name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container password-icon">
        </span>
        <el-input clearable :maxlength="50" name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item prop="captcha" v-if="false">
        <el-input name="captcha" type="text" @keyup.enter.native="handleLogin" v-model="loginForm.captcha"></el-input>
        <img @load="imgLoading = true;" ref="captchaImgBox" class="captcha-img" :src="imgSrc" alt="">
        <el-button type="text" @click="handleImg">换一张</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as api from "api/login";
import * as THREE from "three";
import Base64 from "utils/base64";
export default {
  name: "login",
  data() {
    return {
      loginTip: "",
      imgSrc: "/kaptcha",
      imgLoading: true,
      loginForm: {
        username: "",
        password: "",
        captcha: ""
      },
      loginRules: {
        username: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        captcha: [
          {
            required: true,
            message: "请输入图中的验证码",
            trigger: "blur"
          }
        ]
      },
      loading: false,
      showDialog: false
    };
  },
  created() {},
  mounted() {
    // this.$refs.captchaImgBox.addEventListener("load", () => {
    //   this.imgLoading = true;
    // });
    container = document.createElement("div");
    this.$refs.can.appendChild(container);

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.z = 1000;

    scene = new THREE.Scene();

    particles = new Array();

    var PI2 = Math.PI * 2;
    var material = new THREE.ParticleCanvasMaterial({
      color: 0x0078de,
      program: function(context) {
        context.beginPath();
        context.arc(0, 0, 1, 0, PI2, true);
        context.fill();
      }
    });

    var i = 0;

    for (var ix = 0; ix < AMOUNTX; ix++) {
      for (var iy = 0; iy < AMOUNTY; iy++) {
        particle = particles[i++] = new THREE.Particle(material);
        particle.position.x = ix * SEPARATION - AMOUNTX * SEPARATION / 2;
        particle.position.z = iy * SEPARATION - AMOUNTY * SEPARATION / 2;
        scene.add(particle);
      }
    }

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    document.addEventListener("mousemove", onDocumentMouseMove, false);
    //

    window.addEventListener("resize", onWindowResize, false);

    animate();
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("userLogin", {
              username: this.loginForm.username.trim(),
              password: Base64.encode(this.loginForm.password),
              captcha: Base64.encode(this.loginForm.captcha)
            })
            .then(data => {
              this.loading = false;
              console.log(data);

              const { message, status } = data;
              switch (status) {
                case "success":
                console.log('success')
                  this.$router.push('/');
                  break;

                default:
                  this.loginTip = message;
                  break;
              }
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleImg() {
      if (this.imgLoading) {
        // 刷新图片
        this.imgLoading = false; // 防止多次点击频繁刷新
        this.imgSrc = "/kaptcha?" + Math.random();
      }
    }
  }
};

var SEPARATION = 100,
  AMOUNTX = 50,
  AMOUNTY = 50;

var container;
var camera, scene, renderer;

var particles,
  particle,
  count = 0;

var mouseX = 0,
  mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

// animate();

function init() {}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart(event) {
  if (event.touches.length === 1) {
    event.preventDefault();

    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;
  }
}

function onDocumentTouchMove(event) {
  if (event.touches.length === 1) {
    event.preventDefault();

    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;
  }
}

//

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  var i = 0;

  for (var ix = 0; ix < AMOUNTX; ix++) {
    for (var iy = 0; iy < AMOUNTY; iy++) {
      particle = particles[i++];
      particle.position.y =
        Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
      particle.scale.x = particle.scale.y =
        (Math.sin((ix + count) * 0.3) + 1) * 2 +
        (Math.sin((iy + count) * 0.5) + 1) * 2;
    }
  }

  renderer.render(scene, camera);

  count += 0.1;
}
</script>


<style>
.login-container a {
  color: #0078de;
}
#canvascontainer {
  position: absolute;
  top: 0px;
}
.wz-input-group-prepend {
  background-color: #141a48;
  border: 1px solid #2d8cf0;
  border-right: none;
  color: #2d8cf0;
}
</style>
<style lang="scss">
@import "src/styles/mixin.scss";
.login-container {
  @include relative;
  height: 100%;
  background-color: #2d3a4b;
  overflow: hidden;
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #293444 inset !important;
    -webkit-text-fill-color: #fff !important;
  }
  input {
    background: transparent;
    border: 0;
    -webkit-appearance: none;
    border-radius: 0;
    padding: 12px 0px 12px 5px;
    color: #eeeeee;
    height: 47px;
  }
  input[name="captcha"] {
    text-align: center;
  }
  .el-input {
    vertical-align: middle;
    display: inline-block;
    height: 47px;
    width: 87%;
  }
  .svg-container {
    // padding: 6px 5px 6px 15px;
    margin-left: 10px;
    // color: #889aa4;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: #eeeeee;
    margin: 0 auto 40px;
    text-align: center;
    font-weight: bold;
  }
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 35px 35px 15px;
    margin: 120px auto;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-form-item:nth-child(5) {
    text-align: left;
    border: none;
    background: transparent;
    .el-input {
      width: 26%;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    .captcha-img {
      display: inline-block;
      vertical-align: top;
      height: 47px;
      border: none;
      width: 26%;
    }
    .el-button--text {
      color: #eee;
    }
  }
  .forget-pwd {
    color: #fff;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 5px;
  }
  .login-tip {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-bottom: 4px;
  }
}
</style>
