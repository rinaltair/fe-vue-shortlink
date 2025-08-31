<template>
  <div class="card about-project art-custom-card">
    <div>
      <h2 class="box-title">About the Project</h2>
      <p>{{ systemName }} is an admin template focused on UX and visual design.</p>
      <p>Built with Vue 3, TypeScript, Vite, and Element Plus.</p>

      <div class="button-wrap">
        <div class="btn art-custom-card" @click="goPage(WEB_LINKS.DOCS)">
          <span>Website</span>
          <i class="iconfont-sys">&#xe703;</i>
        </div>
        <div class="btn art-custom-card" @click="goPage(WEB_LINKS.INTRODUCE)">
          <span>Docs</span>
          <i class="iconfont-sys">&#xe703;</i>
        </div>
        <div class="btn art-custom-card" @click="goPage(WEB_LINKS.GITHUB_HOME)">
          <span>Github</span>
          <i class="iconfont-sys">&#xe703;</i>
        </div>
        <div class="btn art-custom-card" @click="goPage(WEB_LINKS.BLOG)">
          <span>Blog</span>
          <i class="iconfont-sys">&#xe703;</i>
        </div>
      </div>
    </div>
    <img class="right-img" src="@imgs/draw/draw1.png" alt="draw1" />
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { WEB_LINKS } from '@/utils/constants'

  const systemName = AppConfig.systemInfo.name

  const goPage = (url: string) => {
    window.open(url)
  }
</script>

<style lang="scss" scoped>
  .about-project {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    height: 300px;
    padding: 20px;

    h2 {
      margin-top: 10px;
      font-size: 20px;
      font-weight: 500;
      color: var(--art-gray-900) !important;
    }

    p {
      margin-top: 5px;
      font-size: 14px;
      color: var(--art-gray-600);
    }
  }

  .button-wrap {
    display: flex;
    flex-wrap: wrap;
    width: 600px;
    margin-top: 35px;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 240px;
    height: 50px;
    padding: 0 15px;
    margin: 0 15px 15px 0;
    font-size: 14px;
    color: var(--art-gray-800);
    cursor: pointer;
    background: var(--art-bg-color);
    border-radius: calc(var(--custom-radius) / 2 + 2px) !important;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 5px 10px rgb(0 0 0 / 5%);
      transform: translateY(-4px);
    }
  }

  // Responsive - iPad Pro and below
  @media screen and (max-width: $device-ipad-pro) {
    .about-project {
      height: auto;
    }

    .button-wrap {
      width: 470px;
      margin-top: 20px;
    }

    .btn {
      width: 180px;
    }

    .right-img {
      width: 300px;
      height: 230px;
    }
  }

  // Responsive - iPad vertical and below
  @media screen and (max-width: $device-ipad-vertical) {
    .button-wrap {
      width: 100%;
    }

    .btn {
      width: 190px;
    }

    .right-img {
      display: none;
    }
  }

  // Responsive - Mobile
  @media screen and (max-width: $device-phone) {
    .about-project {
      padding: 0 15px;
    }

    .btn {
      width: 100%;
      margin-right: 0;
    }
  }
</style>
