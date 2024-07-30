export default function (self) {
  if (window.scrollY > self.$refs.mainContainer.offsetTop) {
    self.$refs.topButtonsContainer.classList.add("dark:bg-surface--dark-600");
    self.$refs.topButtonsContainer.classList.add("rounded-t-none");
    self.$refs.topButtonsContainer.classList.add("shadow");
    self.$refs.topButtonsContainer.classList.add("sticky");
    self.$refs.topButtonsContainer.classList.add("top-0");
    self.$refs.topButtonsContainer.classList.add("z-10");
  } else {
    self.$refs.topButtonsContainer.classList.remove(
      "dark:bg-surface--dark-600"
    );
    self.$refs.topButtonsContainer.classList.remove("rounded-t-none");
    self.$refs.topButtonsContainer.classList.remove("shadow");
    self.$refs.topButtonsContainer.classList.remove("sticky");
    self.$refs.topButtonsContainer.classList.remove("top-0");
    self.$refs.topButtonsContainer.classList.remove("z-10");
  }
}
