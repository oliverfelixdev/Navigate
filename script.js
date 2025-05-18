let svgManipulation = () => {
  const items = document.querySelectorAll(".svg-item");
  const container = document.querySelector(".vector-graphics");

  let currentIndexes = [...items].map((_, i) => i);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function shuffleImages() {
    gsap.to(items, {
      scale: 0,
      duration: 0.4,
      stagger: {
        each: 0.1,
        from: "random",
      },
      ease: "power1.in",
      onComplete: () => {
        const shuffled = shuffleArray([...items]);
        shuffled.forEach((item) => container.appendChild(item));

        gsap.fromTo(
          shuffled,
          {
            scale: 0,
          },
          {
            scale: 1,
            duration: 0.5,
            stagger: {
              each: 0.1,
              from: "random",
            },
            ease: "expo.out",
          }
        );
      },
    });
  }

  gsap.fromTo(
    items,
    { scale: 0 },
    { scale: 1, duration: 0.5, stagger: 0.05, ease: "expo.out" }
  );

  setInterval(shuffleImages, 4250);
};
svgManipulation();

function buttonStaggerAnimation() {
  const buttons = document.querySelectorAll("[anm-stagger-btn=wrap]");

  buttons.forEach((button) => {
    const text = button.querySelector("[anm-stagger-btn=text]");
    const direction = button.getAttribute("anm-direction");
    const isReverse = button.getAttribute("anm-reverse");
    const stagger = button.getAttribute("anm-stagger") || 0.0075;
    const delay = button.getAttribute("anm-delay") || 0;
    const duration = button.getAttribute("anm-duration") || 0.5;
    const ease = button.getAttribute("anm-ease") || "power3.inOut";
    const custom = button.getAttribute("anm-custom") || "";

    const parseCustomAttribute = (attr) => {
      const props = {};
      if (attr) {
        attr.split(",").forEach((pair) => {
          const [key, value] = pair.split(":").map((item) => item.trim());
          if (key && value) {
            props[key] = value;
          }
        });
      }
      return props;
    };

    const transformValuesForToState = (element, props) => {
      const transformedValues = {};
      const computedStyles = window.getComputedStyle(element);
      for (const key in props) {
        let value = props[key];
        if (key === "opacity") {
          transformedValues[key] = "1";
        } else {
          transformedValues[key] = value.replace(/(\d+(\.\d+)?)/g, (match) => {
            const unitMatch = match.match(
              /(\d+(\.\d+)?)(px|rem|em|%|vh|vw|dvh|dvw|deg|rad|grad|turn|cvw|cvh)?/
            );
            return unitMatch ? `0${unitMatch[3] || ""}` : "0";
          });

          if (!/\d/.test(value)) {
            transformedValues[key] = computedStyles[key] || value;
          }
        }
      }
      return transformedValues;
    };

    const animationProps = parseCustomAttribute(custom);
    const toStateProps = transformValuesForToState(text, animationProps);

    const textClone = text.cloneNode(true);
    textClone.style.position = "absolute";
    textClone.style.top = 0;
    textClone.style.left = 0;
    textClone.style.width = "100%";
    textClone.style.height = "100%";

    text.after(textClone);

    const textSplit = new SplitType(text, { types: "chars" });
    const clonedSplit = new SplitType(textClone, { types: "chars" });

    const timeline = gsap.timeline({
      defaults: {
        ease: ease,
        delay: delay,
        duration: duration,
        stagger: stagger,
      },
      paused: true,
    });

    if (direction === "up") {
      textClone.style.top = "100%";
      timeline
        .fromTo(
          textSplit.chars,
          { yPercent: 0, ...animationProps },
          { yPercent: -140, ...toStateProps }
        )
        .fromTo(
          clonedSplit.chars,
          { yPercent: 0, ...animationProps },
          { yPercent: -140, ...toStateProps },
          "<"
        );
    } else if (direction === "down") {
      textClone.style.top = "-100%";
      timeline
        .fromTo(
          textSplit.chars,
          { yPercent: 0, ...animationProps },
          { yPercent: 140, ...toStateProps }
        )
        .fromTo(
          clonedSplit.chars,
          { yPercent: 0, ...animationProps },
          { yPercent: 140, ...toStateProps },
          "<"
        );
    }

    button.addEventListener("mouseenter", () => {
      timeline.restart();
    });

    button.addEventListener("mouseleave", () => {
      if (isReverse === "true") {
        timeline.reverse();
      }
    });
  });
}
buttonStaggerAnimation();

let cursorMain = () => {
  const cursor = new MouseFollower();
  const el = document.querySelector("main");
  const images = document.querySelectorAll(".svg-item img");

  el.addEventListener("mouseenter", () => {
    cursor.setSkewing(4);
  });

  el.addEventListener("mouseleave", () => {
    cursor.removeSkewing();
  });

  images.forEach((img) => {
    img.addEventListener("mouseenter", () => {
      cursor.addState("-inverse");
    });

    img.addEventListener("mouseleave", () => {
      cursor.removeState("-inverse");
    });
  });
};
cursorMain();
