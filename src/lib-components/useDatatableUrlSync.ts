import { ref, onMounted } from 'vue'

export default function useDatatableUrlSync() {
  const counter = ref<number>(0)
  const incrementCounter = async () => {
    setInterval(() => {
      counter.value++;
    }, 1000)
  }

  onMounted(incrementCounter)

  return {
    counter,
  }
}