<template>
  <div class="container">
    <div class="cabecalho">
      <h1><a href="#/home">Home</a></h1>
      <div class="auth-links">
        <div class="sign-in">
          <a href="#/login">Login</a>
        </div><!--Fim div Sign-in-->
        <div class="sign-up">
          <a href="#/cadastro">Cadastrar-se</a>
        </div><!--Fim div Sign-up-->
      </div><!--Fim div Auth-links-->
    </div><!--Fim div Cabecalho-->
    <div class="conteudo-principal">
      <p>Bem-vindes a página principal!</p>

      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">

      <!-- Uploaded to: SVG Repo, www.svgrepo.com, Transformed by: SVG Repo Mixer Tools -->
      <svg
        width="400px"
        height="400px"
        viewBox="-102.4 -102.4 1228.80 1228.80"
        class="icon"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        fill="#000000"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0" />

        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke="#CCCCCC"
          stroke-width="16.384"
        />

        <g id="SVGRepo_iconCarrier">
          <path
            d="M512 960c-92.8 0-160-200-160-448S419.2 64 512 64s160 200 160 448-67.2 448-160 448z m0-32c65.6 0 128-185.6 128-416S577.6 96 512 96s-128 185.6-128 416 62.4 416 128 416z"
            fill="#ababab"
          />

          <path
            d="M124.8 736c-48-80 92.8-238.4 307.2-363.2S852.8 208 899.2 288 806.4 526.4 592 651.2 171.2 816 124.8 736z m27.2-16c33.6 57.6 225.6 17.6 424-97.6S905.6 361.6 872 304 646.4 286.4 448 401.6 118.4 662.4 152 720z"
            fill="#ababab"
          />

          <path
            d="M899.2 736c-46.4 80-254.4 38.4-467.2-84.8S76.8 368 124.8 288s254.4-38.4 467.2 84.8S947.2 656 899.2 736z m-27.2-16c33.6-57.6-97.6-203.2-296-318.4S184 246.4 152 304 249.6 507.2 448 622.4s392 155.2 424 97.6z"
            fill="#ababab"
          />

          <path
            d="M512 592c-44.8 0-80-35.2-80-80s35.2-80 80-80 80 35.2 80 80-35.2 80-80 80zM272 312c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48zM416 880c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z m448-432c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z"
            fill="#f25050"
          />
        </g>
      </svg>
    </div>
    <!--Fim div Conteudo Principal-->
  </div>
  <!--Fim div Container-->
</template>

<style scoped>
.cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.auth-links {
  margin-left: auto;
  display: flex;
}

.auth-links .sign-in,
.auth-links .sign-up {
  margin-left: 10px;
}

svg {
  animation: rotate 8s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
