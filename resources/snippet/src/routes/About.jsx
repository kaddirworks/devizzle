import React from "react";

class About extends React.Component {
  constructor({ props }) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <div className="content">
          <section className="section" id="main">
            <h1>About</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Recusandae, tenetur? Quibusdam eos molestias sed dignissimos,
              aspernatur eum maxime veritatis hic, ratione in fugit, earum et
              aliquam blanditiis iste sequi assumenda?
            </p>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum
              nemo aspernatur nihil ut neque delectus impedit deserunt ullam
              magnam quo blanditiis itaque quam voluptatem, dolorum totam modi
              voluptates nobis sit. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Dicta quasi soluta voluptatum accusantium?
              Sapiente, tempore nesciunt alias obcaecati quo repudiandae, ea
              accusantium molestiae adipisci illum repellendus impedit odit.
              Culpa, veritatis. Lorem ipsum dolor sit amet consectetur,
              adipisicing elit. Distinctio voluptatem maiores expedita illum,
              facilis ut laborum repudiandae pariatur cum voluptatibus aperiam
              fuga, nostrum consequuntur praesentium illo debitis. Nesciunt,
              porro in.
            </p>
          </section>
        </div>
      </div>
    );
  }
}
export default About;
