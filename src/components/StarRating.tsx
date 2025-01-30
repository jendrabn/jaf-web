function StarRating({ rate }: { rate: number }) {
  return (
    <div className="d-inline-flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`fa fa-star text-${
            star <= rate ? "warning" : "secondary"
          }`}
        ></i>
      ))}
    </div>
  );
}

export default StarRating;
