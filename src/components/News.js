import { useEffect, useState } from "react";
import Newsitem from "./Newsitem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, settotalResults] = useState(0);

  const updateNews = async () => {
    props.setprogress(0);
    const url = `https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    props.setprogress(30);
    let data = await fetch(url);
    let parseData = await data.json();
    props.setprogress(60);
    setArticles((prev) => prev.concat(parseData.articles || []));
    props.setprogress(80);
    settotalResults(parseData.totalResults || 0);
    props.setprogress(100);
    setLoading(false);
  };

  useEffect(() => {
    document.title = `${props.category
      .charAt(0)
      .toUpperCase()}${props.category.slice(1)}`;
    updateNews();
    // eslint-disable-next-line
  }, []);

  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${
      props.country
    }&category=${props.category}&apiKey=${props.apikey}&page=${
      page + 1
    }&pageSize=${props.pageSize}`;
    setPage(page + 1);
    let data = await fetch(url);
    let parseData = await data.json();
    // loading(false);
    setArticles((prev) => prev.concat(parseData.articles || []));
    settotalResults(parseData.totalResults || 0);
  };
  return (
    <>
      <div style={{ "margin-top": "65px" }}>
        <h1 className="text-center">
          <strong>Real news in real time.</strong>
        </h1>
        <h3 className="text-center mb-4 text-dark">
          <strong>
            Top headlines{" "}
            {props.category === "general" ? "" : "- " + props.category}
          </strong>
        </h3>
        <div className="ml-15 mr-15 mb-3 border-top border-2 border-dark"></div>
      </div>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={loading && <Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map((e) => {
              return (
                <div key={e.url} className="col-md-4">
                  <Newsitem
                    title={e.title ? e.title : ""}
                    description={e.description ? e.description : ""}
                    imageUrl={e.urlToImage}
                    newsUrl={e.url}
                    date={e.publishedAt}
                    name={e.source.name}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 6,
  category: "general",
};
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  setprogress: PropTypes.func.isRequired,
};
export default News;

