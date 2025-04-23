<script>
export default {
  name: "ActivityCard",
  props: {
    title: String,
    image: String,
    people: Number
  }
};

</script>

<template>
  <Card style="width: 25rem; overflow: hidden">
    <template #header>
      <img alt="user header" src="https://primefaces.org/cdn/primevue/images/usercard.png" />
    </template>
    <template #title>Advanced Card</template>
    <template #subtitle>Card subtitle</template>
    <template #content>
      <p class="m-0">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
        quas!
      </p>
    </template>
  </Card>
</template>

  <style scoped>
/*ESTILO GENERALES*/
title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}
  </style>